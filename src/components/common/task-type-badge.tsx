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

export type TaskTypeBadgeVariant = "outline" | "solid" | "subtle";

export interface TaskTypeBadgeProps extends React.ComponentProps<typeof Badge> {
	name: string;
	color?: string;
	typeVariant?: TaskTypeBadgeVariant;
	interactive?: boolean;
	options?: { id: string; name: string; color?: string }[];
	value?: string;
	onValueChange?: (id: string) => void;
	disabled?: boolean;
}

/**
 * Reusable badge component for displaying Task Type.
 * Dynamically applies colors based on task type specifications with premium styling.
 * Supports "outline", "solid" (full-color background with foreground text), and "subtle" (tinted background) variants.
 * If options and onValueChange are provided, it operates as a fully functional Dropdown select.
 */
export function TaskTypeBadge({
	name,
	color,
	className,
	typeVariant = "solid",
	interactive = false,
	options,
	value,
	onValueChange,
	disabled,
	...props
}: Omit<TaskTypeBadgeProps, "onChange">) {
	const isSolid = typeVariant === "solid";
	const isSubtle = typeVariant === "subtle";
	const isOutline = typeVariant === "outline";

	const badgeStyle: React.CSSProperties = {
		...props.style,
	};

	if (color) {
		if (isSolid) {
			badgeStyle.backgroundColor = color;
			badgeStyle.color = "var(--foreground)";
			badgeStyle.borderColor = "transparent";
		} else if (isSubtle) {
			badgeStyle.backgroundColor = `${color}15`; // ~10% opacity tinted background
			badgeStyle.color = color;
			badgeStyle.borderColor = "transparent";
		} else if (isOutline) {
			badgeStyle.borderColor = `${color}30`;
			badgeStyle.color = color;
			badgeStyle.backgroundColor = "transparent";
		}
	}

	const isDropdown = interactive && options && onValueChange && !disabled;

	const badge = (
		<Badge
			data-slot="task-type-badge"
			variant="outline"
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
				interactive && !disabled && "cursor-pointer hover:bg-muted/50",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
			style={badgeStyle}
			{...props}
		>
			<span className="max-w-24 truncate text-primary-foreground" title={name}>
				{name}
			</span>
			{interactive && (
				<ChevronDown className="size-3 shrink-0 opacity-50 text-primary-foreground" />
			)}
		</Badge>
	);

	if (isDropdown) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={disabled}>
					{badge}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="min-w-32.5">
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
