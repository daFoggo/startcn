import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimePicker } from "./time-picker";

export interface DateTimePickerProps {
	date?: Date;
	onChange?: (date: Date) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
	/** Extra classes applied to the trigger Button */
	triggerClassName?: string;
	/** Hide the leading calendar icon */
	hideIcon?: boolean;
}

export function DateTimePicker({
	date,
	onChange,
	label,
	disabled,
	className,
	triggerClassName,
	hideIcon,
}: DateTimePickerProps) {
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		date,
	);

	React.useEffect(() => {
		setSelectedDate(date);
	}, [date]);

	const handleDateSelect = (d: Date | undefined) => {
		if (!d) return;
		const newDate = new Date(d);
		if (selectedDate) {
			newDate.setHours(selectedDate.getHours());
			newDate.setMinutes(selectedDate.getMinutes());
		} else {
			newDate.setHours(9, 0, 0, 0);
		}
		setSelectedDate(newDate);
		onChange?.(newDate);
	};

	const handleTimeChange = (timeStr: string) => {
		if (!timeStr?.includes(":")) return;
		const [h, m] = timeStr.split(":").map(Number);
		if (Number.isNaN(h) || Number.isNaN(m)) return;

		const newDate =
			selectedDate && !Number.isNaN(selectedDate.getTime())
				? new Date(selectedDate)
				: new Date();
		newDate.setHours(h);
		newDate.setMinutes(m);
		newDate.setSeconds(0, 0);
		setSelectedDate(newDate);
		onChange?.(newDate);
	};

	const timeValue =
		selectedDate && !Number.isNaN(selectedDate.getTime())
			? `${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`
			: "09:00";

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<Popover modal={false}>
				<PopoverTrigger
					render={
						<Button
							variant={"outline"}
							disabled={disabled}
							className={cn(
								"w-full justify-start text-left font-normal",
								!selectedDate && "text-muted-foreground",
								triggerClassName,
							)}
						/>
					}
				>
					{!hideIcon && <CalendarIcon className="mr-2 size-4" />}
					{selectedDate && !Number.isNaN(selectedDate.getTime()) ? (
						format(selectedDate, "PPP HH:mm")
					) : (
						<span>{label || "Pick a date"}</span>
					)}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<div className="flex flex-col">
						<div className="flex justify-center">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={handleDateSelect}
								autoFocus
								className="w-fit"
							/>
						</div>
						<div className="flex items-center justify-between border-t p-2">
							<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
								<Clock className="size-4" />
								<span>Time</span>
							</div>
							<TimePicker
								value={timeValue}
								onChange={handleTimeChange}
								className="h-8 w-fit rounded-md border bg-background px-2 text-sm"
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
