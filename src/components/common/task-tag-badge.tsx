import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TaskTagBadgeVariant = "outline" | "solid" | "subtle";

export interface TaskTagBadgeProps extends React.ComponentProps<typeof Badge> {
	name: string;
	color?: string;
	tagVariant?: TaskTagBadgeVariant;
}

/**
 * Reusable premium badge component for displaying Task Tags.
 * Supports custom hex colors from Tailwind palette or database.
 * Offers "outline", "solid", and "subtle" (tinted bg) variants to match task dashboard aesthetics.
 */
export function TaskTagBadge({
	name,
	color,
	className,
	tagVariant = "subtle",
	...props
}: TaskTagBadgeProps) {
	const isSolid = tagVariant === "solid";
	const isSubtle = tagVariant === "subtle";
	const isOutline = tagVariant === "outline";

	const badgeStyle: React.CSSProperties = {
		...props.style,
	};

	if (color) {
		if (isSolid) {
			badgeStyle.backgroundColor = color;
			badgeStyle.color = "var(--primary-foreground)";
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

	return (
		<Badge
			data-slot="task-tag-badge"
			variant="outline"
			className={cn(
				"inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-semibold transition-all duration-200 hover:opacity-90",
				className,
			)}
			style={badgeStyle}
			{...props}
		>
			<span className="max-w-28 truncate" title={name}>
				{name}
			</span>
		</Badge>
	);
}
