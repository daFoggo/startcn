import { IconActivity, IconBolt, IconInfoCircle } from "@tabler/icons-react";
import { useMemo } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceArea,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { TBuildingActivityWindow } from "../../schemas";
import {
	CardTitleWithIcon,
	type ProjectDetailProps,
	ReadOnlyFact,
} from "./shared";

const powerTraceChartConfig = {
	power: {
		label: "Whole-house load",
		color: "var(--chart-1)",
	},
	waterFlow: {
		label: "Hot-water flow",
		color: "var(--chart-5)",
	},
	kettle: {
		label: "Kettle",
		color: "var(--chart-4)",
	},
	laundry: {
		label: "Laundry",
		color: "var(--chart-2)",
	},
	dishwasher: {
		label: "Dishwasher",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

const activityWindowColors: Record<
	TBuildingActivityWindow["colorKey"],
	string
> = {
	dishwasher: "var(--chart-3)",
	kettle: "var(--chart-4)",
	laundry: "var(--chart-2)",
};

export function RealTimeBuildingContext({ project }: ProjectDetailProps) {
	const context = project.buildingContext;
	const powerTrace = useMemo(
		() =>
			context.powerTraceKw.map((power, index) => {
				const minutesAgo = (context.powerTraceKw.length - 1 - index) * 2;
				const totalMinutes = 19 * 60 + 21 - minutesAgo;
				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				return {
					power,
					time: `${hours.toString().padStart(2, "0")}:${minutes
						.toString()
						.padStart(2, "0")}`,
					waterFlow: context.waterFlowTraceLpm[index] ?? 0,
				};
			}),
		[context.powerTraceKw, context.waterFlowTraceLpm],
	);

	return (
		<section>
			<Card className="overflow-hidden">
				<CardHeader className="pb-3">
					<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<CardTitleWithIcon icon={IconActivity}>
							Live sensor context
						</CardTitleWithIcon>
						<p className="text-xs font-medium text-muted-foreground">
							{context.liveAt}
						</p>
					</div>
				</CardHeader>
				<CardContent className="grid gap-4 lg:grid-cols-[18rem_1fr]">
					<div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
						{context.metrics.map((metric) => (
							<ReadOnlyFact
								icon={IconBolt}
								key={metric.label}
								label={metric.label}
								value={`${metric.value}${metric.helper ? ` - ${metric.helper}` : ""}`}
							/>
						))}
					</div>

					<div className="flex flex-col gap-3">
						<div className="rounded-lg border px-3 py-2">
							<div className="flex items-center justify-between gap-3">
								<div className="flex flex-col gap-0.5">
									<p className="text-sm font-medium">Recent sensor traces</p>
									<p className="text-xs text-muted-foreground">
										Colored spans mark activity windows AnnoBot is using as
										evidence.
									</p>
								</div>
								<p className="shrink-0 text-xs text-muted-foreground">
									last 30 min
								</p>
							</div>
							<PowerTraceChart
								activitySpans={context.activityWindows}
								data={powerTrace}
							/>
						</div>

						<div className="rounded-lg border bg-muted/30 px-3 py-2">
							<div className="flex items-center gap-2">
								<IconInfoCircle className="size-4 shrink-0 text-muted-foreground" />
								<p className="text-sm font-medium">Prompt budget today</p>
							</div>
							<p className="mt-1 text-xs text-muted-foreground">
								{context.learningSummary}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function PowerTraceChart({
	activitySpans,
	data,
}: {
	activitySpans: Array<TBuildingActivityWindow>;
	data: Array<{ power: number; time: string; waterFlow: number }>;
}) {
	if (data.length === 0) {
		return (
			<p className="py-6 text-center text-sm text-muted-foreground">
				No live trace is available for this project.
			</p>
		);
	}

	const liveTime = data.at(-1)?.time;

	return (
		<div className="mt-3 flex flex-col gap-3">
			<ChartContainer
				className="aspect-auto h-52 w-full"
				config={powerTraceChartConfig}
				initialDimension={{ width: 640, height: 208 }}
			>
				<LineChart
					accessibilityLayer
					data={data}
					margin={{ bottom: 8, left: 0, right: 16, top: 12 }}
				>
					<CartesianGrid vertical />
					<XAxis
						axisLine={false}
						dataKey="time"
						interval={2}
						minTickGap={16}
						tickLine={false}
					/>
					<YAxis
						axisLine={false}
						domain={[0, "dataMax + 0.5"]}
						tickLine={false}
						unit=" kW"
						width={52}
						yAxisId="power"
					/>
					<YAxis
						axisLine={false}
						domain={[0, "dataMax + 0.5"]}
						orientation="right"
						tickLine={false}
						unit=" L/m"
						width={56}
						yAxisId="flow"
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								formatter={(value, name) => {
									const isWaterFlow = name === "waterFlow";
									return (
										<>
											<span className="text-muted-foreground">
												{isWaterFlow ? "Hot-water flow" : "Whole-house"}
											</span>
											<span className="font-mono font-medium">
												{Number(value).toFixed(isWaterFlow ? 1 : 2)}{" "}
												{isWaterFlow ? "L/min" : "kW"}
											</span>
										</>
									);
								}}
								hideLabel={false}
							/>
						}
					/>
					{activitySpans.map((span) => (
						<ReferenceArea
							fill={activityWindowColors[span.colorKey]}
							fillOpacity={0.16}
							ifOverflow="extendDomain"
							key={span.id}
							stroke={activityWindowColors[span.colorKey]}
							strokeDasharray="3 3"
							strokeOpacity={0.7}
							x1={span.start}
							x2={span.end}
						/>
					))}
					{liveTime && (
						<ReferenceLine
							stroke="var(--border)"
							strokeDasharray="4 4"
							x={liveTime}
						/>
					)}
					<Line
						activeDot={{ r: 4 }}
						dataKey="power"
						dot={false}
						stroke="var(--color-power)"
						strokeWidth={2}
						type="monotone"
						yAxisId="power"
					/>
					<Line
						activeDot={{ r: 4 }}
						dataKey="waterFlow"
						dot={false}
						stroke="var(--color-waterFlow)"
						strokeWidth={2}
						type="monotone"
						yAxisId="flow"
					/>
				</LineChart>
			</ChartContainer>

			<div className="grid gap-2 sm:grid-cols-3">
				{activitySpans.map((span) => (
					<div
						className="overflow-hidden rounded-lg border bg-muted/20"
						key={span.id}
					>
						<div
							className="h-1"
							style={{
								backgroundColor: activityWindowColors[span.colorKey],
							}}
						/>
						<div className="px-3 py-2">
							<p className="text-xs font-semibold">{span.label}</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Detected {span.start} - {span.end}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
