import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EVENT_TYPE_OPTIONS } from "../constants";
import type { TEventType } from "../schemas";

interface IEventTypeBadgeProps {
	type: TEventType | string;
	className?: string;
}

export function EventTypeBadge({ type, className }: IEventTypeBadgeProps) {
	const option = EVENT_TYPE_OPTIONS.find((opt) => opt.value === type);

	if (!option) {
		return (
			<Badge
				variant="secondary"
				className={cn("font-mono capitalize", className)}
			>
				{String(type).replace("_", " ")}
			</Badge>
		);
	}

	const Icon = option.icon;

	return (
		<Badge
			variant="outline"
			className={cn(
				"gap-1.5 border-transparent font-medium capitalize",
				option.bgClass,
				option.colorClass,
				className,
			)}
		>
			<Icon className="size-3.5" />
			{option.label}
		</Badge>
	);
}
