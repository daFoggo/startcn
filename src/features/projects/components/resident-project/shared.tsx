import {
	IconAdjustments,
	type IconBolt,
	IconCircleCheck,
	IconClock,
	IconDatabase,
	IconDroplet,
	IconFileText,
	IconGauge,
	IconHeart,
	IconMapPin,
	IconRouter,
	IconTemperature,
	IconWifi,
} from "@tabler/icons-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TAnnotationSource, TAnnotationSourceFilter } from "../../schemas";

export type ProjectDetailProps = {
	project: import("../../schemas").TProjectDetail;
};

export type TitleIcon = typeof IconBolt;

export const sourceLabels: Record<TAnnotationSource, string> = {
	YOU_SAID: "YOU SAID",
	BOT_INFERRED: "BOT INFERRED",
	SENSOR_AUTO: "SENSOR AUTO",
	CALENDAR: "CALENDAR",
	PENDING: "PENDING",
	LATER: "LATER",
};

export const sourceVariants: Record<
	TAnnotationSource,
	"default" | "secondary" | "destructive" | "outline"
> = {
	YOU_SAID: "default",
	BOT_INFERRED: "secondary",
	SENSOR_AUTO: "outline",
	CALENDAR: "outline",
	PENDING: "destructive",
	LATER: "secondary",
};

export const sourceToFilter = (
	source: TAnnotationSource,
): Exclude<TAnnotationSourceFilter, "all"> => {
	if (source === "YOU_SAID") return "YOU";
	if (source === "PENDING" || source === "LATER") return "PENDING";
	return "AUTO";
};

export const formatPercent = (value: number) => `${Math.round(value)}%`;

export function CardTitleWithIcon({
	children,
	icon: Icon,
}: {
	children: React.ReactNode;
	icon: TitleIcon;
}) {
	return (
		<CardTitle className="flex items-center gap-2">
			<Icon className="size-4 shrink-0 text-muted-foreground" />
			<span>{children}</span>
		</CardTitle>
	);
}

export function ReadOnlyFact({
	icon: Icon,
	label,
	value,
}: {
	icon?: TitleIcon;
	label: string;
	value: string;
}) {
	return (
		<div className="rounded-lg border bg-background px-4 py-3">
			<div className="flex items-center gap-2">
				{Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
				<p className="text-xs text-muted-foreground">{label}</p>
			</div>
			<p className="mt-1 text-sm">{value}</p>
		</div>
	);
}

export function FilterButton({
	active,
	children,
	onClick,
}: {
	active: boolean;
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<Button
			onClick={onClick}
			size="sm"
			variant={active ? "default" : "outline"}
		>
			{children}
		</Button>
	);
}

export function SourceBadge({ source }: { source: TAnnotationSource }) {
	return <Badge variant={sourceVariants[source]}>{sourceLabels[source]}</Badge>;
}

export function SensorIcon({ type }: { type: string }) {
	const normalizedType = type.toLowerCase();
	const Icon = normalizedType.includes("water")
		? IconDroplet
		: normalizedType.includes("presence")
			? IconRouter
			: normalizedType.includes("environment")
				? IconTemperature
				: IconGauge;

	return <Icon className="size-4 shrink-0 text-current" />;
}

export function SensorFact({
	className,
	emphasis,
	label,
	value,
	icon: CustomIcon,
}: {
	className?: string;
	emphasis?: boolean;
	label: string;
	value: string;
	icon?: React.ComponentType<{ className?: string }>;
}) {
	const normalizedLabel = label.toLowerCase();
	let IconComponent = IconClock;

	if (normalizedLabel.includes("location")) {
		IconComponent = IconMapPin;
	} else if (normalizedLabel.includes("reading")) {
		IconComponent = IconGauge;
	} else if (normalizedLabel.includes("latency")) {
		IconComponent = IconWifi;
	} else if (normalizedLabel.includes("health")) {
		IconComponent = IconHeart;
	} else if (normalizedLabel.includes("status")) {
		IconComponent = IconCircleCheck;
	} else if (normalizedLabel.includes("quote")) {
		IconComponent = IconFileText;
	} else if (normalizedLabel.includes("raw")) {
		IconComponent = IconDatabase;
	} else if (normalizedLabel.includes("control")) {
		IconComponent = IconAdjustments;
	}

	const Icon = CustomIcon || IconComponent;

	return (
		<div
			className={cn(
				"rounded-lg border bg-muted/20 px-4 py-3",
				emphasis && "bg-muted/30",
				className,
			)}
		>
			<div
				className={cn(
					"flex gap-3",
					emphasis ? "flex-col items-start" : "items-center justify-between",
				)}
			>
				<div className="flex min-w-0 items-center gap-2 text-muted-foreground">
					<Icon className="size-4 shrink-0" />
					<p className="truncate text-xs">{label}</p>
				</div>
				<p
					className={cn(
						"font-medium",
						emphasis
							? "text-2xl"
							: "max-w-[65%] text-right text-sm break-words",
					)}
				>
					{value}
				</p>
			</div>
		</div>
	);
}

export function CompletionBar({ value }: { value: number }) {
	return (
		<div className="h-2 overflow-hidden rounded-full bg-muted">
			<div
				className="h-full rounded-full bg-primary"
				style={{ width: `${value}%` }}
			/>
		</div>
	);
}
