import { CALENDAR_HOUR_HEIGHT, getCalendarTimeSlots } from "@/lib/big-calendar";
import { cn } from "@/lib/utils";

interface IBigCalendarTimeGutterProps {
	startHour?: number;
	endHour?: number;
	hourHeight?: number;
	className?: string;
}

/**
 * Cột giờ bên trái của week view.
 * Hiển thị label giờ (00:00, 01:00…) căn với top của mỗi hour row.
 */
export function BigCalendarTimeGutter({
	startHour = 0,
	endHour = 24,
	hourHeight = CALENDAR_HOUR_HEIGHT,
	className,
}: IBigCalendarTimeGutterProps) {
	const slots = getCalendarTimeSlots(startHour, endHour);

	return (
		<div
			className={cn(
				"relative w-14 shrink-0 select-none border-b border-border/50",
				className,
			)}
			style={{ height: (endHour - startHour) * hourHeight }}
		>
			{slots.map(({ hour, label }) => (
				<div
					key={hour}
					className="absolute right-0 flex w-full items-start justify-end pr-2"
					style={{ top: (hour - startHour) * hourHeight }}
				>
					{/* Ẩn label 00:00 đầu tiên để tránh bị clip */}
					{hour !== startHour && (
						<span className="-translate-y-1/2 text-xs font-medium text-muted-foreground/70">
							{label}
						</span>
					)}
				</div>
			))}
		</div>
	);
}
