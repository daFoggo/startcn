import {
	IconChevronLeft as ChevronLeft,
	IconChevronRight as ChevronRight,
	IconLayoutColumns as Columns4,
	IconLayoutRows as Rows4,
} from "@tabler/icons-react";
import { format, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	formatCalendarWeekRange,
	getCalendarWeekDays,
} from "@/lib/big-calendar";
import { cn } from "@/lib/utils";
import {
	useCalendarActions,
	useCalendarCurrentDate,
	useCalendarView,
	useCalendarWeekStartsOn,
} from "@/stores/use-big-calendar-store";
import type { TCalendarView } from "@/types/big-calendar";

/**
 * Default toolbar của BigCalendar.
 * Hiển thị: [Today] [←] range [→]  …  [Week|Day] tabs
 */
interface IBigCalendarHeaderProps {
	className?: string;
}

export function BigCalendarHeader({ className }: IBigCalendarHeaderProps) {
	const currentDate = useCalendarCurrentDate();
	const weekStartsOn = useCalendarWeekStartsOn();
	const view = useCalendarView();
	const { goToday, goPrev, goNext, setView } = useCalendarActions();

	const weekDays = getCalendarWeekDays(currentDate, weekStartsOn);
	const hasToday =
		view === "week" ? weekDays.some((d) => isToday(d)) : isToday(currentDate);

	const rangeText =
		view === "week"
			? formatCalendarWeekRange(currentDate, weekStartsOn)
			: format(currentDate, "EEEE, MMM d, yyyy");

	return (
		<div className={cn("flex items-center gap-2 border-b p-2", className)}>
			{/* Today button */}
			<Button
				variant={hasToday ? "default" : "outline"}
				size="sm"
				onClick={goToday}
			>
				Today
			</Button>

			{/* Prev / Next */}
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="icon"
					onClick={goPrev}
					aria-label="Previous"
				>
					<ChevronLeft className="size-3.5" />
				</Button>
				<Button variant="ghost" size="icon" onClick={goNext} aria-label="Next">
					<ChevronRight className="size-3.5" />
				</Button>
			</div>

			{/* Range title */}
			<span className="text-sm font-medium text-foreground">{rangeText}</span>

			{/* Spacer */}
			<div className="flex-1" />

			{/* View switcher — góc phải */}
			<Tabs value={view} onValueChange={(v) => setView(v as TCalendarView)}>
				<TabsList>
					<TabsTrigger value="day" className="text-xs">
						<Rows4 className="size-3.5" />
						<span>Day</span>
					</TabsTrigger>
					<TabsTrigger value="week" className="text-xs">
						<Columns4 className="size-3.5" />
						<span>Week</span>
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
