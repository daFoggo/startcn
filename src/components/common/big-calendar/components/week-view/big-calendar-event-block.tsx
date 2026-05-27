import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type React from "react";
import { CALENDAR_HOUR_HEIGHT, snapToGrid } from "@/lib/big-calendar";
import { cn } from "@/lib/utils";
import type {
	IBigCalendarEvent,
	IBigCalendarEventLayout,
} from "@/types/big-calendar";

interface IBigCalendarEventBlockProps {
	layout: IBigCalendarEventLayout;
	onClick?: (event: IBigCalendarEvent) => void;
	renderEvent?: (
		event: IBigCalendarEvent,
		layout: IBigCalendarEventLayout,
	) => React.ReactNode;
	hourHeight?: number;
}

// Padding giữa các event overlap (px)
const COLUMN_GAP = 2;

/**
 * Absolute-positioned event block trong day column.
 * Tính width/left dựa trên column + totalColumns để xếp cạnh nhau.
 * Hỗ trợ renderEvent để feature custom toàn bộ nội dung.
 */
export function BigCalendarEventBlock({
	layout,
	onClick,
	renderEvent,
	hourHeight = CALENDAR_HOUR_HEIGHT,
}: IBigCalendarEventBlockProps) {
	const { event, top, height, column, totalColumns } = layout;
	const isTask = event.meta?.type === "task";

	const {
		attributes,
		listeners,
		setNodeRef,
		transform: moveTransform,
		isDragging,
		setActivatorNodeRef,
	} = useDraggable({
		id: `event-${event.id}`,
		data: {
			type: "event",
			event,
			layout,
		},
		disabled: isTask,
	});

	const {
		setNodeRef: setResizeRef,
		attributes: resizeAttributes,
		listeners: resizeListeners,
		isDragging: isResizing,
		transform: resizeTransform,
	} = useDraggable({
		id: `resize-${event.id}`,
		data: {
			type: "resize",
			event,
			layout,
		},
		disabled: isTask,
	});

	const widthPercent = 100 / totalColumns;
	const leftPercent = widthPercent * column;

	// Dùng color từ event hoặc fallback về primary
	const accentColor = event.color ?? "var(--primary)";

	const style: React.CSSProperties = {
		top,
		height: isResizing
			? Math.max(
					snapToGrid(height + (resizeTransform?.y ?? 0), hourHeight) - 1,
					4,
				)
			: Math.max(height - 1, 4),
		left: `calc(${leftPercent}% + ${COLUMN_GAP}px)`,
		width: `calc(${widthPercent}% - ${COLUMN_GAP * 2}px)`,
		transform:
			isDragging && moveTransform
				? CSS.Translate.toString({
						...moveTransform,
						y: snapToGrid(moveTransform.y, hourHeight),
					})
				: undefined,
		opacity: isDragging ? 0.4 : 1,
		zIndex: isDragging || isResizing ? 50 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"absolute overflow-hidden rounded-md focus-visible:outline-none",
				"transition-opacity duration-150 focus-visible:ring-1 focus-visible:ring-ring",
				onClick ? "cursor-pointer" : "cursor-default",
				isDragging && "pointer-events-none ring-2 ring-primary ring-offset-2",
				(isDragging || isResizing) && "border-2 border-dashed border-primary",
			)}
			{...attributes}
		>
			{/* Draggable handle (body) */}
			<div
				ref={setActivatorNodeRef}
				{...listeners}
				className="h-full w-full"
				onClick={() => !isDragging && onClick?.(event)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onClick?.(event);
				}}
			>
				{renderEvent ? (
					renderEvent(event, layout)
				) : (
					<BigCalendarEventContent
						event={event}
						accentColor={accentColor}
						height={height}
					/>
				)}
			</div>

			{/* Resize handle */}
			{!isTask && (
				<div
					ref={setResizeRef}
					{...resizeAttributes}
					{...resizeListeners}
					className={cn(
						"absolute right-0 bottom-0 left-0 h-1.5 cursor-ns-resize transition-colors hover:bg-primary/30",
						isResizing && "bg-primary/50",
					)}
				/>
			)}
		</div>
	);
}

// ─── Default event content ────────────────────────────────────────────────────

export interface IBigCalendarEventContentProps {
	event: IBigCalendarEvent;
	accentColor?: string;
	height: number;
}

export function BigCalendarEventContent({
	event,
	accentColor,
	height,
}: IBigCalendarEventContentProps) {
	const finalColor = accentColor ?? event.color ?? "var(--primary)";
	const isCompact = height < 32;

	return (
		<div
			className="flex h-full w-full flex-col overflow-hidden rounded-md border px-2 py-1 transition-all hover:brightness-95"
			style={{
				borderColor: `color-mix(in oklch, ${finalColor} 15%, transparent)`,
				backgroundColor: `color-mix(in oklch, ${finalColor} 25%, transparent)`,
			}}
		>
			<span
				className="truncate text-xs leading-tight font-bold tracking-tight"
				style={{ color: finalColor }}
			>
				{event.title}
			</span>

			{!isCompact && (
				<div className="mt-0.5 flex flex-col gap-0.5">
					<span
						className="truncate text-xs leading-none font-medium opacity-70"
						style={{ color: finalColor }}
					>
						{formatEventTimeRange(event.start, event.end)}
					</span>
					{Boolean(event.meta?.location) && (
						<span
							className="truncate text-xs font-bold tracking-wider uppercase opacity-50"
							style={{ color: finalColor }}
						>
							{String(event.meta?.location)}
						</span>
					)}
				</div>
			)}
		</div>
	);
}

function formatEventTime(date: Date): string {
	const h = date.getHours();
	const m = date.getMinutes();
	const ampm = h >= 12 ? "PM" : "AM";
	const hour = h % 12 || 12;
	return m === 0
		? `${hour} ${ampm}`
		: `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatEventTimeRange(start: Date, end: Date): string {
	const isSameDay =
		start.getFullYear() === end.getFullYear() &&
		start.getMonth() === end.getMonth() &&
		start.getDate() === end.getDate();

	if (isSameDay) {
		return `${formatEventTime(start)} - ${formatEventTime(end)}`;
	}

	return `${start.toLocaleDateString()} ${formatEventTime(start)} - ${end.toLocaleDateString()} ${formatEventTime(end)}`;
}
