import { Skeleton } from "@/components/ui/skeleton";
import {
	CALENDAR_DEFAULT_END_HOUR,
	CALENDAR_DEFAULT_START_HOUR,
	CALENDAR_HOUR_HEIGHT,
} from "@/lib/big-calendar";
import { cn } from "@/lib/utils";

interface IBigCalendarSkeletonProps {
	className?: string;
	headerClassName?: string;
	startHour?: number;
	endHour?: number;
	hourHeight?: number;
}

export function BigCalendarSkeleton({
	className,
	headerClassName,
	startHour = CALENDAR_DEFAULT_START_HOUR,
	endHour = CALENDAR_DEFAULT_END_HOUR,
	hourHeight = CALENDAR_HOUR_HEIGHT,
}: IBigCalendarSkeletonProps) {
	const totalGridHeight = (endHour - startHour) * hourHeight;

	return (
		<div
			className={cn(
				"flex min-h-0 flex-1 flex-col overflow-hidden bg-background",
				className,
			)}
		>
			{/* Skeleton Toolbar */}
			<div
				className={cn("flex items-center gap-2 border-b p-2", headerClassName)}
			>
				<Skeleton className="h-9 w-16" />
				<div className="flex items-center gap-1">
					<Skeleton className="h-9 w-9" />
					<Skeleton className="h-9 w-9" />
				</div>
				<Skeleton className="h-5 w-40" />
				<div className="flex-1" />
				<Skeleton className="h-9 w-32" />
			</div>

			{/* Skeleton Week View */}
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				{/* Sticky day header row */}
				<div className="flex shrink-0 border-b bg-card">
					<div className="w-14 shrink-0" />
					{["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
						<div
							key={`header-${day}`}
							className="min-w-0 flex-1 border-l border-border/50"
						>
							<div className="flex items-center justify-center gap-1 py-2">
								<Skeleton className="h-4 w-7" />
								<Skeleton className="size-5 rounded-sm" />
							</div>
						</div>
					))}
				</div>

				{/* Scrollable time grid */}
				<div className="no-scrollbar flex min-h-0 flex-1 overflow-y-auto">
					{/* Time gutter */}
					<div
						className="relative w-14 shrink-0 select-none"
						style={{ height: totalGridHeight }}
					>
						{Array.from({ length: endHour - startHour }).map((_, i) => {
							const slotKey = `gutter-slot-${i}`;
							return (
								<div
									key={slotKey}
									className="absolute right-0 flex w-full items-start justify-end pr-2"
									style={{ top: i * hourHeight }}
								>
									{i !== 0 && <Skeleton className="h-3 w-8 -translate-y-1/2" />}
								</div>
							);
						})}
					</div>

					{/* Day columns */}
					<div
						className="flex min-w-0 flex-1"
						style={{ height: totalGridHeight }}
					>
						{["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
							(day, colIdx) => (
								<div
									key={`col-${day}`}
									className="relative min-w-0 flex-1 border-l border-border/50"
								>
									{/* Giả lập time slots lines */}
									{Array.from({ length: endHour - startHour }).map(
										(_, rowIdx) => {
											const rowKey = `row-slot-${rowIdx}`;
											return (
												<div
													key={rowKey}
													className="absolute left-0 right-0 border-t border-border/50"
													style={{
														top: rowIdx * hourHeight,
														height: hourHeight,
													}}
												/>
											);
										},
									)}

									{/* Giả lập vài event blocks cho sinh động */}
									{colIdx === 1 && (
										<Skeleton className="absolute left-1 right-1 top-32 h-32 rounded-md opacity-50" />
									)}
									{colIdx === 2 && (
										<Skeleton className="absolute left-1 right-1 top-16 h-16 rounded-md opacity-50" />
									)}
									{colIdx === 4 && (
										<Skeleton className="absolute left-1 right-1 top-60 h-44 rounded-md opacity-50" />
									)}
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
