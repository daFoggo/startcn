import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import React from "react";
import {
	CALENDAR_DEFAULT_END_HOUR,
	CALENDAR_DEFAULT_START_HOUR,
	CALENDAR_HOUR_HEIGHT,
	getCalendarDateFromOffset,
	getCalendarWeekDays,
} from "@/lib/big-calendar";
import { cn } from "@/lib/utils";
import {
	useCalendarCurrentDate,
	useCalendarWeekStartsOn,
} from "@/stores/use-big-calendar-store";
import type {
	IBigCalendarEvent,
	IBigCalendarEventLayout,
	IBigCalendarSlotInfo,
} from "@/types/big-calendar";
import { BigCalendarDayHeader } from "../header/big-calendar-day-header";
import { BigCalendarDayColumn } from "./big-calendar-day-column";
import { BigCalendarTimeGutter } from "./big-calendar-time-gutter";

interface IBigCalendarWeekViewProps {
	events: IBigCalendarEvent[];
	startHour?: number;
	endHour?: number;
	hourHeight?: number;
	onSelectEvent?: (event: IBigCalendarEvent) => void;
	onSelectSlot?: (slot: IBigCalendarSlotInfo) => void;
	renderEvent?: (
		event: IBigCalendarEvent,
		layout: IBigCalendarEventLayout,
	) => React.ReactNode;
	slotClassName?: (date: Date, hour: number) => string;
	scrollToHour?: number;
	onEventDrop?: (event: IBigCalendarEvent, start: Date, end: Date) => void;
	onEventResize?: (event: IBigCalendarEvent, start: Date, end: Date) => void;
	className?: string;
}

/**
 * Week view: header row + scrollable time grid.
 */
export function BigCalendarWeekView({
	events,
	startHour = CALENDAR_DEFAULT_START_HOUR,
	endHour = CALENDAR_DEFAULT_END_HOUR,
	hourHeight = CALENDAR_HOUR_HEIGHT,
	onSelectEvent,
	onSelectSlot,
	renderEvent,
	slotClassName,
	className,
	scrollToHour,
	onEventDrop,
	onEventResize,
}: IBigCalendarWeekViewProps) {
	const currentDate = useCalendarCurrentDate();
	const weekStartsOn = useCalendarWeekStartsOn();
	const weekDays = getCalendarWeekDays(currentDate, weekStartsOn);
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);

	// Chiều cao tổng của grid
	const totalGridHeight = (endHour - startHour) * hourHeight;

	// Auto scroll khi mount hoặc khi scrollToHour thay đổi
	React.useEffect(() => {
		if (
			scrollToHour !== undefined &&
			scrollContainerRef.current &&
			scrollToHour >= startHour &&
			scrollToHour <= endHour
		) {
			const scrollOffset = (scrollToHour - startHour) * hourHeight;
			scrollContainerRef.current.scrollTop = scrollOffset;
		}
	}, [scrollToHour, startHour, endHour, hourHeight]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over, delta } = event;
		if (!over) return;

		const activeData = active.data.current;
		const overData = over.data.current;

		if (!activeData) return;

		if (activeData.type === "event") {
			// Logic for moving event
			const targetDay =
				overData?.type === "day" ? (overData.day as Date) : null;
			if (!targetDay) return;

			const layout = activeData.layout as IBigCalendarEventLayout;
			const calendarEvent = activeData.event as IBigCalendarEvent;

			// Calculate new top based on delta
			const newTop = layout.top + delta.y;
			// Calculate new duration
			const durationMs =
				calendarEvent.end.getTime() - calendarEvent.start.getTime();

			// Calculate new start date
			const newStart = getCalendarDateFromOffset(
				newTop,
				targetDay,
				startHour,
				hourHeight,
			);

			// Snap to grid (15 mins)
			const snappedStart = new Date(
				Math.round(newStart.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000),
			);
			const snappedEnd = new Date(snappedStart.getTime() + durationMs);

			onEventDrop?.(calendarEvent, snappedStart, snappedEnd);
		} else if (activeData.type === "resize") {
			// Logic for resizing event
			const layout = activeData.layout as IBigCalendarEventLayout;
			const calendarEvent = activeData.event as IBigCalendarEvent;

			// Calculate new height
			const newHeight = layout.height + delta.y;
			const newEnd = getCalendarDateFromOffset(
				layout.top + newHeight,
				calendarEvent.start,
				startHour,
				hourHeight,
			);

			// Snap to grid (15 mins)
			const snappedEnd = new Date(
				Math.round(newEnd.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000),
			);

			// Ensure minimum 15 mins
			if (snappedEnd.getTime() - calendarEvent.start.getTime() < 15 * 60 * 1000)
				return;

			onEventResize?.(calendarEvent, calendarEvent.start, snappedEnd);
		}
	};

	return (
		<div
			className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
		>
			{/* ── Sticky day header row ── */}
			<div className="flex shrink-0 border-b bg-card">
				{/* Spacer căn với time gutter */}
				<div className="w-14 shrink-0" />
				{/* Day headers */}
				{weekDays.map((day) => (
					<div
						key={day.toISOString()}
						className="min-w-0 flex-1 border-l border-border/50"
					>
						<BigCalendarDayHeader date={day} />
					</div>
				))}
			</div>

			{/* ── Scrollable time grid ── */}
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToFirstScrollableAncestor]}
			>
				<div
					ref={scrollContainerRef}
					className="no-scrollbar flex min-h-0 flex-1 overflow-y-auto"
				>
					{/* Time gutter */}
					<BigCalendarTimeGutter
						startHour={startHour}
						endHour={endHour}
						hourHeight={hourHeight}
					/>

					{/* Day columns — explicit height để border-l đúng toàn grid */}
					<div
						className="flex min-w-0 flex-1"
						style={{ height: totalGridHeight }}
					>
						{weekDays.map((day) => (
							<BigCalendarDayColumn
								key={day.toISOString()}
								day={day}
								events={events}
								startHour={startHour}
								endHour={endHour}
								hourHeight={hourHeight}
								onSelectEvent={onSelectEvent}
								onSelectSlot={onSelectSlot}
								renderEvent={renderEvent}
								slotClassName={slotClassName}
							/>
						))}
					</div>
				</div>
			</DndContext>
		</div>
	);
}
