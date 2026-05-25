import { BarChart3, TriangleAlertIcon } from "lucide-react";
import * as React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Rectangle,
	XAxis,
	YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import type { TProjectTaskStats, TStatsPeriod } from "../schemas";

type ViewMode = "priority" | "status" | "type";

interface IProjectTaskStatsCardProps {
	stats?: TProjectTaskStats;
	period: TStatsPeriod;
	onPeriodChange: (period: TStatsPeriod) => void;
	isLoading?: boolean;
	isError?: boolean;
	error?: unknown;
}

export const ProjectTaskStatsCard = React.memo(
	({
		stats,
		period,
		onPeriodChange,
		isLoading = false,
		isError = false,
		error,
	}: IProjectTaskStatsCardProps) => {
		const [mode, setMode] = React.useState<ViewMode>("priority");

		// Map API response sang format cho BarChart
		const data = React.useMemo(() => {
			if (!stats) return [];
			const source =
				mode === "priority"
					? stats.by_priority
					: mode === "status"
						? stats.by_status
						: stats.by_type;
			return source.map((item) => ({
				name: item.name,
				value: item.count,
				fill: item.color,
			}));
		}, [stats, mode]);

		return (
			<Card>
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="flex flex-col">
							<CardTitle>Total Tasks</CardTitle>
						</div>
						<div className="flex items-center gap-2">
							{/* Period toggle */}
							<ButtonGroup orientation="horizontal">
								<Button
									size="xs"
									variant={period === "weekly" ? "default" : "outline"}
									onClick={() => onPeriodChange("weekly")}
								>
									Weekly
								</Button>
								<Button
									size="xs"
									variant={period === "monthly" ? "default" : "outline"}
									onClick={() => onPeriodChange("monthly")}
								>
									Monthly
								</Button>
							</ButtonGroup>
							{/* View mode toggle */}
							<ButtonGroup orientation="horizontal">
								<Button
									size="xs"
									variant={mode === "priority" ? "default" : "outline"}
									onClick={() => setMode("priority")}
								>
									Priority
								</Button>
								<Button
									size="xs"
									variant={mode === "status" ? "default" : "outline"}
									onClick={() => setMode("status")}
								>
									Status
								</Button>
								<Button
									size="xs"
									variant={mode === "type" ? "default" : "outline"}
									onClick={() => setMode("type")}
								>
									Type
								</Button>
							</ButtonGroup>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<Skeleton className="h-60 w-full rounded-lg" />
					) : isError ? (
						<Alert variant="destructive">
							<TriangleAlertIcon className="size-4" />
							<AlertTitle>Error loading stats</AlertTitle>
							<AlertDescription>
								{getErrorMessage(
									error,
									"An error occurred while fetching the project task statistics.",
								)}
							</AlertDescription>
						</Alert>
					) : data.length === 0 ? (
						<div className="flex h-60 items-center justify-center">
							<Empty className="h-auto flex-none border-0 p-0">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<BarChart3 />
									</EmptyMedia>
									<EmptyTitle>No tasks found</EmptyTitle>
									<EmptyDescription>
										No tasks found for this period.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</div>
					) : (
						<ChartContainer
							id="project-stats"
							className="aspect-auto"
							config={{ value: { label: "Tasks", color: "var(--chart-1)" } }}
							style={{ height: 240 }}
						>
							<BarChart data={data} barCategoryGap="20%" barGap={8}>
								<CartesianGrid strokeDasharray="3 3" vertical={true} />
								<XAxis dataKey="name" tickLine={false} />
								<YAxis allowDecimals={false} width={44} />
								<ChartTooltip
									content={
										<ChartTooltipContent
											labelKey="name"
											nameKey="value"
											indicator="dot"
										/>
									}
								/>
								<Bar
									dataKey="value"
									radius={[8, 8, 0, 0]}
									shape={(props: any) => {
										const { fill: _fill, ...others } = props;
										return <Rectangle {...others} fill={props.payload.fill} />;
									}}
								/>
							</BarChart>
						</ChartContainer>
					)}
				</CardContent>
			</Card>
		);
	},
);

ProjectTaskStatsCard.displayName = "ProjectTaskStatsCard";
