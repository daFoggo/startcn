import { memo } from "react";
import { RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

interface IProjectRiskGaugeProps {
	overallRiskIndex: number;
}

const gaugeConfig = {
	riskIndex: {
		label: "Risk Score",
	},
} satisfies ChartConfig;

export const ProjectRiskGauge = memo(
	({ overallRiskIndex }: IProjectRiskGaugeProps) => {
		const overallRiskPct = Math.round(overallRiskIndex * 100);
		let gaugeColor = "var(--chart-2)";
		let gaugeLabel = "Low Risk";
		if (overallRiskPct >= 70) {
			gaugeColor = "var(--destructive)";
			gaugeLabel = "High Risk";
		} else if (overallRiskPct >= 40) {
			gaugeColor = "var(--chart-3)";
			gaugeLabel = "Moderate Risk";
		}

		const gaugeData = [
			{ name: "riskIndex", value: overallRiskPct, fill: gaugeColor },
		];

		return (
			<Card className="col-span-1">
				<CardHeader>
					<CardTitle className="text-center">Project Risk Score</CardTitle>
				</CardHeader>
				<CardContent className="relative flex justify-center overflow-hidden">
					<div className="relative flex h-45 items-center justify-center">
						<ChartContainer config={gaugeConfig} className="h-full w-full">
							<RadialBarChart
								cx="50%"
								cy="100%"
								innerRadius="80%"
								outerRadius="100%"
								barSize={16}
								data={gaugeData}
								startAngle={180}
								endAngle={0}
							>
								<RadialBar background dataKey="value" cornerRadius={10} />
							</RadialBarChart>
						</ChartContainer>
						<div className="absolute bottom-0 text-center">
							<span className="text-3xl font-bold text-foreground">
								{overallRiskPct}%
							</span>
							<p
								className="mt-1 text-xs font-bold"
								style={{ color: gaugeColor }}
							>
								{gaugeLabel}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	},
);

ProjectRiskGauge.displayName = "ProjectRiskGauge";
