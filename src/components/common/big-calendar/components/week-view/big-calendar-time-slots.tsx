import { addMinutes, isBefore } from "date-fns";
import type React from "react";
import { useRef, useState } from "react";
import {
	CALENDAR_HOUR_HEIGHT,
	getCalendarDateFromOffset,
	getCalendarTimeSlots,
	snapToGrid,
} from "@/lib/big-calendar";
import { cn } from "@/lib/utils";
import type { IBigCalendarSlotInfo } from "@/types/big-calendar";

interface IBigCalendarTimeSlotsProps {
	day: Date;
	startHour?: number;
	endHour?: number;
	hourHeight?: number;
	onSelectSlot?: (slot: IBigCalendarSlotInfo) => void;
	slotClassName?: (date: Date, hour: number) => string;
	className?: string;
}

export function BigCalendarTimeSlots({
	day,
	startHour = 0,
	endHour = 24,
	hourHeight = CALENDAR_HOUR_HEIGHT,
	onSelectSlot,
	slotClassName,
	className,
}: IBigCalendarTimeSlotsProps) {
	const slots = getCalendarTimeSlots(startHour, endHour);
	const containerRef = useRef<HTMLDivElement>(null);

	// startAnchor: điểm click chuột đầu tiên
	const [startAnchor, setStartAnchor] = useState<Date | null>(null);
	const [startPointerY, setStartPointerY] = useState<number | null>(null);
	const [hasDraggedSelection, setHasDraggedSelection] = useState(false);
	// selection: range thực tế (đã sắp xếp start < end)
	const [selection, setSelection] = useState<{ start: Date; end: Date } | null>(
		null,
	);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button !== 0) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const y = e.clientY - rect.top;
		const snappedY = snapToGrid(y, hourHeight);
		const startDate = getCalendarDateFromOffset(
			snappedY,
			day,
			startHour,
			hourHeight,
		);

		setStartAnchor(startDate);
		setStartPointerY(y);
		setHasDraggedSelection(false);
		setSelection({ start: startDate, end: addMinutes(startDate, 15) });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!startAnchor) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const y = e.clientY - rect.top;
		const snappedY = snapToGrid(y, hourHeight);
		const currentDate = getCalendarDateFromOffset(
			snappedY,
			day,
			startHour,
			hourHeight,
		);

		if (startPointerY !== null && Math.abs(y - startPointerY) > 4) {
			setHasDraggedSelection(true);
		}

		if (isBefore(currentDate, startAnchor)) {
			setSelection({ start: currentDate, end: startAnchor });
		} else {
			setSelection({
				start: startAnchor,
				end:
					currentDate.getTime() === startAnchor.getTime()
						? addMinutes(startAnchor, 15)
						: currentDate,
			});
		}
	};

	const handleMouseUp = () => {
		if (!selection || !startAnchor) {
			setSelection(null);
			setStartAnchor(null);
			setStartPointerY(null);
			setHasDraggedSelection(false);
			return;
		}

		if (hasDraggedSelection) {
			onSelectSlot?.({
				...selection,
				dayOfWeek: day.getDay(),
			});
		}

		setSelection(null);
		setStartAnchor(null);
		setStartPointerY(null);
		setHasDraggedSelection(false);
	};

	return (
		<div
			ref={containerRef}
			className={cn("relative w-full border-b border-border/50", className)}
			style={{ height: (endHour - startHour) * hourHeight }}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			// Không nên set null ở onMouseLeave vì user có thể kéo ra ngoài rồi quay lại
		>
			{slots.map(({ hour }) => (
				<div
					key={hour}
					className={cn(
						"pointer-events-none absolute right-0 left-0 border-t border-border/50",
						slotClassName?.(day, hour),
					)}
					style={{
						top: (hour - startHour) * hourHeight,
						height: hourHeight,
					}}
				/>
			))}

			{/* Selection Preview Overlay */}
			{selection && (
				<div
					className="pointer-events-none absolute right-0 left-0 z-20 rounded-md border-2 border-dashed border-primary bg-primary/15"
					style={{
						top:
							((selection.start.getHours() - startHour) * 60 +
								selection.start.getMinutes()) *
							(hourHeight / 60),
						height:
							Math.max(
								(selection.end.getTime() - selection.start.getTime()) /
									(60 * 1000),
								1,
							) *
							(hourHeight / 60),
					}}
				/>
			)}
		</div>
	);
}
