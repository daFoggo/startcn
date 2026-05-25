import { memo, useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import type { TRiskStatsTask } from "../schemas";

interface IRiskDriversChartProps {
	tasks: TRiskStatsTask[];
}

const radarConfig = {
	value: {
		label: "Risk Signal",
		color: "var(--destructive)",
	},
} satisfies ChartConfig;

export const RiskDriversChart = memo(({ tasks }: IRiskDriversChartProps) => {
	const radarData = useMemo(() => {
		let totalTimeVar = 0,
			totalSched = 0,
			totalCongest = 0,
			totalBlocked = 0;
		const numTasks = tasks.length || 1;

		tasks.forEach((t) => {
			if (t.signals) {
				if (t.signals.is_over_estimate) totalTimeVar += 100;
				if (t.signals.has_schedule_bottleneck) totalSched += 100;
				if (
					t.signals.parallel_tasks_count &&
					t.signals.parallel_tasks_count > 3
				)
					totalCongest += 100;
				if (t.signals.is_blocked) totalBlocked += 100;
			}
		});

		return [
			{ subject: "Schedule Slippage", value: totalTimeVar / numTasks },
			{ subject: "Team Bottlenecks", value: totalSched / numTasks },
			{ subject: "Workload Pressure", value: totalCongest / numTasks },
			{ subject: "Blocked Work", value: totalBlocked / numTasks },
			{
				subject: "Near Due Date",
				value:
					(tasks.filter((t) => t.days_remaining <= 2 && t.days_remaining >= 0)
						.length /
						numTasks) *
					100,
			},
		];
	}, [tasks]);

	return (
		<Card className="col-span-1">
			<CardHeader>
				<CardTitle className="text-center">Main Risk Drivers</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-50">
					<ChartContainer config={radarConfig} className="h-full w-full">
						<RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
							<PolarGrid />
							<PolarAngleAxis dataKey="subject" fontSize={10} />
							<Radar
								name="Risk Signal"
								dataKey="value"
								fill="var(--color-value)"
								stroke="var(--color-value)"
								fillOpacity={0.25}
							/>
							<ChartTooltip
								content={({ active, payload }) => {
									if (active && payload?.length) {
										return (
											<div className="rounded-lg border bg-background/95 p-2 text-xs shadow-xl backdrop-blur-sm">
												<p className="mb-1 font-bold">{payload[0].name}</p>
												<p className="text-muted-foreground">
													Value:{" "}
													<strong>
														{Math.round(payload[0].value as number)}%
													</strong>
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
						</RadarChart>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
});

RiskDriversChart.displayName = "RiskDriversChart";
