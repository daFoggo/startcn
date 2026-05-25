import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface TaskStatusBadgeProps
	extends React.ComponentProps<typeof Badge> {
	name: string;
	color?: string;
	interactive?: boolean;
	options?: { id: string; name: string; color?: string }[];
	value?: string;
	onValueChange?: (id: string) => void;
	disabled?: boolean;
}

/**
 * Reusable badge component for displaying Task Status.
 * Supports interactive indicators (e.g. dropdown trigger chevron) and hover styles.
 * If options and onValueChange are provided, it operates as a fully functional Dropdown select.
 */
export function TaskStatusBadge({
	name,
	color,
	interactive = false,
	options,
	value,
	onValueChange,
	disabled,
	className,
	variant = "outline",
	...props
}: Omit<TaskStatusBadgeProps, "onChange">) {
	const isDropdown = interactive && options && onValueChange && !disabled;

	const badge = (
		<Badge
			data-slot="task-status-badge"
			variant={variant}
			className={cn(
				"gap-1.5 font-medium transition-colors duration-300 ease-in-out",
				interactive && !disabled && "cursor-pointer hover:bg-muted/50",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
			style={{
				borderColor: color && variant === "outline" ? color : undefined,
				color: color && variant === "outline" ? color : undefined,
				backgroundColor: color && variant === "default" ? color : undefined,
				...props.style,
			}}
			{...props}
		>
			<span
				className="size-1.5 shrink-0 rounded-full"
				style={{ backgroundColor: color || "currentColor" }}
			/>
			<span className="truncate">{name}</span>
			{interactive && <ChevronDown className="size-3 shrink-0 opacity-50" />}
		</Badge>
	);

	if (isDropdown) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={disabled}>
					{badge}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="min-w-37.5">
					{options.map((opt) => (
						<DropdownMenuItem
							key={opt.id}
							className="gap-2"
							onClick={(e) => {
								e.stopPropagation();
								if (onValueChange && (!value || value !== opt.id)) {
									onValueChange(opt.id);
								}
							}}
						>
							<span
								className="size-1.5 shrink-0 rounded-full"
								style={{ backgroundColor: opt.color || "currentColor" }}
							/>
							{opt.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return badge;
}
