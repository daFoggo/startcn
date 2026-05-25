import { memo, useMemo } from "react";
import {
	CartesianGrid,
	Cell,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import type { TRiskStatsTask } from "../schemas";

interface IRiskMatrixChartProps {
	tasks: TRiskStatsTask[];
}

const scatterConfig = {
	critical: { label: "High Risk", color: "var(--destructive)" },
	high: { label: "Elevated Risk", color: "var(--chart-4)" },
	medium: { label: "Watch List", color: "var(--chart-3)" },
	low: { label: "Low Risk", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const RiskMatrixChart = memo(({ tasks }: IRiskMatrixChartProps) => {
	const scatterData = useMemo(() => {
		return tasks.map((t) => ({
			...t,
			x: t.days_remaining,
			y: t.risk_score * 100,
			z: t.estimated_hours || 1,
		}));
	}, [tasks]);

	const getBubbleColor = (risk_level: string) => {
		switch (risk_level) {
			case "critical":
				return scatterConfig.critical.color;
			case "high":
				return scatterConfig.high.color;
			case "medium":
				return scatterConfig.medium.color;
			default:
				return scatterConfig.low.color;
		}
	};

	return (
		<Card className="col-span-1 md:col-span-2">
			<CardHeader>
				<CardTitle>Task Risk Map</CardTitle>
				<CardDescription>X: Days Left | Y: Risk Score</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-55">
					<ChartContainer config={scatterConfig} className="h-full w-full">
						<ScatterChart
							margin={{ top: 10, right: 20, bottom: 10, left: -20 }}
						>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								type="number"
								dataKey="x"
								name="Days Left"
								unit=" days"
								fontSize={12}
								domain={["dataMin", "dataMax + 2"]}
								reversed={true}
							/>
							<YAxis
								type="number"
								dataKey="y"
								name="Risk Score"
								unit="%"
								fontSize={12}
								domain={[0, 100]}
							/>
							<ZAxis
								type="number"
								dataKey="z"
								range={[50, 400]}
								name="Estimated Effort"
							/>
							<ChartTooltip
								cursor={{ strokeDasharray: "3 3" }}
								content={({ active, payload }) => {
									if (active && payload?.length) {
										const data = payload[0].payload as TRiskStatsTask;
										return (
											<div className="w-80 max-w-[320px] rounded-lg border bg-background/95 p-3 shadow-xl backdrop-blur-sm">
												<p className="mb-1 text-sm font-bold">{data.title}</p>
												<p className="mb-2 text-xs text-muted-foreground">
													Owner: {data.assignee_name}
												</p>
												<div className="mb-2 grid grid-cols-2 gap-2 text-xs">
													<div>
														<span className="opacity-70">Risk level:</span>{" "}
														<strong
															className="uppercase"
															style={{
																color: getBubbleColor(data.risk_level),
															}}
														>
															{data.risk_level}
														</strong>
													</div>
													<div>
														<span className="opacity-70">Due in:</span>{" "}
														<strong>{data.days_remaining}d</strong>
													</div>
												</div>
												{data.recommendation && (
													<div className="mt-2 rounded bg-muted/50 p-2 text-xs whitespace-normal">
														{data.recommendation}
													</div>
												)}
											</div>
										);
									}
									return null;
								}}
							/>
							<Scatter data={scatterData} name="Tasks">
								{scatterData.map((entry) => (
									<Cell
										key={`cell-${entry.task_id}`}
										fill={getBubbleColor(entry.risk_level)}
										opacity={0.8}
									/>
								))}
							</Scatter>
						</ScatterChart>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
});

RiskMatrixChart.displayName = "RiskMatrixChart";
