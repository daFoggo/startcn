import { useEffect } from "react";
import {
	CALENDAR_DEFAULT_END_HOUR,
	CALENDAR_DEFAULT_START_HOUR,
	CALENDAR_HOUR_HEIGHT,
} from "@/lib/big-calendar";
import { cn } from "@/lib/utils";
import {
	useCalendarActions,
	useCalendarView,
} from "@/stores/use-big-calendar-store";
import type { IBigCalendarProps } from "@/types/big-calendar";
import { BigCalendarHeader } from "./components/header/big-calendar-header";
import { BigCalendarDayView } from "./components/week-view/big-calendar-day-view";
import { BigCalendarWeekView } from "./components/week-view/big-calendar-week-view";

/**
 * Root component của BigCalendar.
 *
 * Không cần Provider — state quản lý qua Zustand store (useBigCalendarStore).
 * Gọi store.reset() khi mount để init đúng defaultDate và weekStartsOn từ props.
 *
 * Sử dụng:
 * ```tsx
 * <BigCalendar
 *   events={calendarEvents}
 *   weekStartsOn={1}
 *   onSelectSlot={(slot) => openCreateDialog(slot)}
 *   onSelectEvent={(event) => openDetailDrawer(event)}
 * />
 * ```
 */
export function BigCalendar({
	events,
	defaultDate,
	weekStartsOn,
	startHour = CALENDAR_DEFAULT_START_HOUR,
	endHour = CALENDAR_DEFAULT_END_HOUR,
	scrollToHour,
	hourHeight = CALENDAR_HOUR_HEIGHT,
	onSelectEvent,
	onSelectSlot,
	onNavigate: _onNavigate,
	renderEvent,
	renderToolbar,
	headerClassName,
	slotClassName,
	onEventDrop,
	onEventResize,
	className,
}: IBigCalendarProps) {
	const view = useCalendarView();
	const { reset } = useCalendarActions();

	// Init store với giá trị từ props khi mount
	useEffect(() => {
		reset(defaultDate, weekStartsOn);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weekStartsOn, reset, defaultDate]);

	// onNavigate: reserved for future controlled mode
	void _onNavigate;

	return (
		<div
			className={cn(
				"flex min-h-0 flex-1 flex-col overflow-hidden bg-background",
				className,
			)}
		>
			{/* Toolbar */}
			{renderToolbar ? (
				renderToolbar(new Date(), view)
			) : (
				<BigCalendarHeader className={headerClassName} />
			)}

			{/* View */}
			{view === "week" && (
				<BigCalendarWeekView
					events={events}
					startHour={startHour}
					endHour={endHour}
					scrollToHour={scrollToHour}
					hourHeight={hourHeight}
					onSelectEvent={onSelectEvent}
					onSelectSlot={onSelectSlot}
					renderEvent={renderEvent}
					slotClassName={slotClassName}
					onEventDrop={onEventDrop}
					onEventResize={onEventResize}
				/>
			)}
			{view === "day" && (
				<BigCalendarDayView
					events={events}
					startHour={startHour}
					endHour={endHour}
					scrollToHour={scrollToHour}
					hourHeight={hourHeight}
					onSelectEvent={onSelectEvent}
					onSelectSlot={onSelectSlot}
					renderEvent={renderEvent}
					slotClassName={slotClassName}
					onEventDrop={onEventDrop}
					onEventResize={onEventResize}
				/>
			)}
		</div>
	);
}
