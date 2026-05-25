import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { TimePicker } from "@/components/common/date-picker";
import { Field, FieldGroup } from "@/components/ui/field";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/radix-switch";
import { DAYS_OF_WEEK, DISPLAY_ORDER_MON_SUN } from "@/constants/days";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import type { TSchedule, TUpsertScheduleInput } from "../schemas";

type TScheduleView = Omit<TUpsertScheduleInput, "user_id"> & {
	user_id: string | undefined;
};

interface WorkTimePatternEditorProps {
	schedules: TScheduleView[];
	teamId: string;
	userId: string | undefined;
	onUpdate: UseMutationResult<TSchedule, Error, TUpsertScheduleInput, unknown>;
}

export const WorkTimePatternEditor = ({
	schedules,
	teamId,
	userId,
	onUpdate,
}: WorkTimePatternEditorProps) => {
	const handleToggleOff = async (dayIndex: number, currentIsOff: boolean) => {
		const day = schedules[dayIndex];
		try {
			await onUpdate.mutateAsync({
				day_of_week: dayIndex,
				start_time: day.start_time,
				end_time: day.end_time,
				is_off: !currentIsOff,
				team_id: teamId,
				user_id: userId || "",
			});
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to update schedule"));
		}
	};

	const handleTimeChange = async (
		dayIndex: number,
		type: "start" | "end",
		value: string,
	) => {
		const day = schedules[dayIndex];
		const startTime = (type === "start" ? value : day.start_time) || "";
		const endTime = (type === "end" ? value : day.end_time) || "";

		if (!startTime || !endTime) return;

		if (startTime >= endTime) {
			toast.error("End time must be after start time");
			return;
		}

		try {
			await onUpdate.mutateAsync({
				day_of_week: dayIndex,
				start_time: startTime,
				end_time: endTime,
				is_off: day.is_off,
				team_id: teamId,
				user_id: userId || "",
			});
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to update time"));
		}
	};

	return (
		<FieldGroup className="gap-2">
			{DISPLAY_ORDER_MON_SUN.map((dayIndex) => {
				const day = schedules[dayIndex];
				return (
					<Field
						key={dayIndex}
						orientation="horizontal"
						className={cn(
							"justify-between rounded-lg border border-transparent px-2 py-1 transition-colors hover:bg-accent/30",
							day.is_off && "opacity-60",
						)}
					>
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<Switch
								id={`day-${dayIndex}`}
								checked={!day.is_off}
								onCheckedChange={() => handleToggleOff(dayIndex, !!day.is_off)}
							/>
							<label
								htmlFor={`day-${dayIndex}`}
								className="min-w-0 cursor-pointer truncate text-sm font-semibold select-none"
							>
								{DAYS_OF_WEEK[dayIndex].name}
							</label>
						</div>

						<div className="flex w-60 shrink-0 items-center justify-end">
							{!day.is_off ? (
								<InputGroup className="w-full gap-1 overflow-hidden border-none bg-muted p-1 shadow-none ring-0">
									<TimePicker
										value={day.start_time || "09:00"}
										onChange={(val) => handleTimeChange(dayIndex, "start", val)}
										className="flex-1"
										size="sm"
									/>
									<InputGroupText className="shrink-0 px-1 text-xs font-bold text-muted-foreground/30 select-none">
										to
									</InputGroupText>
									<TimePicker
										value={day.end_time || "18:00"}
										onChange={(val) => handleTimeChange(dayIndex, "end", val)}
										className="flex-1"
										size="sm"
									/>
								</InputGroup>
							) : (
								<div className="px-4text-xs flex h-8 w-full items-center justify-center rounded-lg bg-muted/50 font-bold tracking-widest text-muted-foreground/40 select-none">
									Day Off
								</div>
							)}
						</div>
					</Field>
				);
			})}
		</FieldGroup>
	);
};
