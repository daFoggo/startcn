import * as React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface TimePickerProps {
	value?: string; // "HH:mm"
	onChange?: (value: string) => void;
	disabled?: boolean;
	className?: string;
	size?: "sm" | "default";
}

export function TimePicker({
	value = "00:00",
	onChange,
	disabled,
	className,
	size = "default",
}: TimePickerProps) {
	// Generate times every 15 minutes
	const times = React.useMemo(() => {
		const options: string[] = [];
		for (let h = 0; h < 24; h++) {
			for (let m = 0; m < 60; m += 15) {
				options.push(
					`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
				);
			}
		}
		// If the current value is not in the list (e.g. 10:16), add it and sort
		if (value && !options.includes(value)) {
			options.push(value);
			options.sort();
		}
		return options;
	}, [value]);

	return (
		<Select value={value} onValueChange={(val) => val && onChange?.(val)} disabled={disabled}>
			<SelectTrigger
				size={size}
				className={cn(
					"h-full w-full border-none bg-transparent text-center text-xs font-semibold tabular-nums shadow-none ring-0 outline-none focus:bg-accent/50 focus:ring-0 focus-visible:bg-accent/50 focus-visible:ring-0 [&>svg]:hidden",
					className,
				)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="max-h-64 overflow-y-auto [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-slot=select-scroll-up-button]]:hidden">
				{times.map((t) => (
					<SelectItem key={t} value={t}>
						{t}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
