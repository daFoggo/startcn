import {
	IconDeviceMobile,
	IconSatellite,
	IconShieldLock,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TConnectedDevice } from "../../schemas";
import {
	CardTitleWithIcon,
	type ProjectDetailProps,
	SensorFact,
	SensorIcon,
} from "./shared";

const sensorAccentColors = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

export function ResidentProjectSensors({ project }: ProjectDetailProps) {
	const connectedCount = project.overrides.connectedDevices.filter(
		(device) => device.status === "connected",
	).length;

	return (
		<div className="flex flex-col gap-8">
			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<div className="flex flex-wrap items-center gap-2">
						<h2 className="text-base font-medium">Connected sensors</h2>
						<Badge variant="outline">
							{connectedCount}/{project.overrides.connectedDevices.length}{" "}
							online
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
						Building data sources that provide context for prompts and
						auto-labelling.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
					<div className="grid gap-4 md:grid-cols-2">
						{project.overrides.connectedDevices.map((device) => (
							<SensorCard
								accentColor={getSensorAccentColor(device)}
								device={device}
								key={device.id}
							/>
						))}
					</div>

					<div className="flex flex-col gap-4">
						<Card>
							<CardHeader>
								<CardTitleWithIcon icon={IconSatellite}>
									Sensor actions
								</CardTitleWithIcon>
								<CardDescription>
									Connect or remove resident-controlled devices.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								<Button>
									<IconDeviceMobile data-icon="inline-start" />
									<span>Add sensor</span>
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitleWithIcon icon={IconShieldLock}>
									Connection rules
								</CardTitleWithIcon>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								<SensorFact label="Quote policy" value="Event summaries only" />
								<SensorFact label="Raw traces" value="Research team only" />
								<SensorFact
									label="Resident control"
									value="Add or remove device"
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</div>
	);
}

function formatReading(reading?: string) {
	if (!reading) return { value: "Idle", unit: "" };

	if (reading.includes(" C")) {
		return { value: reading.replace(" C", ""), unit: "°C" };
	}

	const parts = reading.split(" ");
	if (parts.length > 1) {
		const val = parts[0];
		const unit = parts.slice(1).join(" ");
		return { value: val, unit: unit };
	}

	return { value: reading, unit: "" };
}

function SensorCard({
	accentColor,
	device,
}: {
	accentColor: string;
	device: TConnectedDevice;
}) {
	const { value, unit } = formatReading(device.reading);

	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						type="button"
						className="group/sensor w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs"
					/>
				}
			>
				<Card
					className={cn(
						"h-full flex flex-col justify-between overflow-hidden cursor-pointer select-none border border-border/50",
						device.status === "offline" && "opacity-60",
					)}
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between gap-3 w-full">
							<div className="flex items-start gap-3 min-w-0">
								<div
									className="rounded-lg border border-current/15 bg-muted/20 p-2 shrink-0 group-hover/sensor:scale-105 transition-transform duration-200"
									style={{ color: accentColor }}
								>
									<SensorIcon type={device.type} />
								</div>
								<div className="min-w-0">
									<span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold leading-none block mb-1">
										{device.type}
									</span>
									<h3
										className="font-heading text-base font-semibold group-hover/sensor:underline decoration-2 truncate"
										style={{ color: accentColor }}
									>
										{device.name}
									</h3>
									<CardDescription className="truncate text-xs mt-0.5">
										{device.location ?? "Whole home"}
									</CardDescription>
								</div>
							</div>

							<div className="flex items-center gap-1.5 shrink-0">
								{device.status === "attention" && (
									<span className="flex size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
								)}
								<Badge
									variant={
										device.status === "connected"
											? "outline"
											: device.status === "attention"
												? "secondary"
												: "destructive"
									}
									className={cn(
										"text-[10px] tracking-wider uppercase font-semibold py-0.5 px-2 leading-none",
										device.status === "attention" &&
											"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
									)}
								>
									{device.status}
								</Badge>
							</div>
						</div>
					</CardHeader>

					<CardContent className="pt-2 mt-auto">
						<div className="pt-3 flex items-baseline gap-1.5 border-t border-muted-foreground/10">
							<span className="text-3xl font-bold tracking-tight font-sans leading-none">
								{value}
							</span>
							{unit && (
								<span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
									{unit}
								</span>
							)}
						</div>
					</CardContent>
				</Card>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div
							className="rounded-lg border border-current/15 bg-muted/20 p-2.5 shrink-0"
							style={{ color: accentColor }}
						>
							<SensorIcon type={device.type} />
						</div>
						<div className="min-w-0">
							<DialogTitle>{device.name}</DialogTitle>
							<DialogDescription className="truncate">
								{device.type} evidence source for prompts and auto-labelling.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="grid gap-3 sm:grid-cols-2 mt-2">
					<SensorFact label="Status" value={device.status} />
					<SensorFact
						label="Location"
						value={device.location ?? "Whole home"}
					/>
					<SensorFact
						label="Current reading"
						value={device.reading ?? "Idle"}
					/>
					<SensorFact label="Latency" value={device.latency ?? "Unknown"} />
				</div>

				<div className="mt-4 rounded-xl border bg-muted/20 px-4 py-3 flex gap-3 items-start">
					<div className="mt-0.5">
						{device.status === "connected" ? (
							<span className="flex size-2.5 rounded-full bg-emerald-500 shrink-0" />
						) : device.status === "attention" ? (
							<span className="flex size-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
						) : (
							<span className="flex size-2.5 rounded-full bg-destructive shrink-0" />
						)}
					</div>
					<p className="text-sm text-muted-foreground leading-snug">
						<strong className="text-foreground font-semibold">
							Device Health:
						</strong>{" "}
						{device.detail}
					</p>
				</div>

				<DialogFooter showCloseButton />
			</DialogContent>
		</Dialog>
	);
}

function getSensorAccentColor(device: TConnectedDevice) {
	const normalizedType = device.type.toLowerCase();

	if (normalizedType.includes("water")) return sensorAccentColors[4];
	if (normalizedType.includes("presence")) return sensorAccentColors[2];
	if (normalizedType.includes("environment")) return sensorAccentColors[3];
	if (normalizedType.includes("electric")) return sensorAccentColors[0];

	return sensorAccentColors[1];
}
