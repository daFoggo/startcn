import { isToday } from "date-fns";
import { formatCalendarDayHeader } from "@/lib/big-calendar";
import { cn } from "@/lib/utils";

interface IBigCalendarDayHeaderProps {
	date: Date;
	/** Cột này có phải là ngày đang được select không (để highlight) */
	isSelected?: boolean;
}

/**
 * Header cho mỗi cột ngày trong week view.
 * Hiển thị: "Mon" ở trên, số ngày ở dưới.
 * Highlight primary nếu là hôm nay.
 */
export function BigCalendarDayHeader({
	date,
	isSelected,
}: IBigCalendarDayHeaderProps) {
	const { dayName, dayNum } = formatCalendarDayHeader(date);
	const today = isToday(date);

	return (
		<div
			className={cn(
				"flex items-center justify-center gap-1 py-2 select-none",
				isSelected && "bg-accent/50",
			)}
		>
			{/* Day name: Mon, Tue… */}
			<span
				className={cn(
					"text-xs font-medium tracking-wide uppercase",
					today ? "text-primary" : "text-muted-foreground",
				)}
			>
				{dayName}
			</span>

			{/* Day number — circle nếu là today */}
			<span
				className={cn(
					"flex size-5 items-center justify-center rounded-sm text-xs font-semibold transition-colors",
					today ? "bg-primary text-primary-foreground" : "text-foreground",
				)}
			>
				{dayNum}
			</span>
		</div>
	);
}
