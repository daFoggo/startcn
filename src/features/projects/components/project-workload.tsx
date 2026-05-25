import { Search, TriangleAlertIcon } from "lucide-react";
import * as React from "react";
import { memo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import type {
	TMemberWorkload,
	TProjectWorkloadResponse,
	TStatsPeriod,
} from "../schemas";

/** Parse "YYYY-MM-DD" string mà không bị lệch timezone */
function parseDateStr(dateStr: string) {
	const [y, m, d] = dateStr.split("-").map(Number);
	return new Date(y, m - 1, d); // local date — không phải UTC
}

interface IProjectWorkloadProps {
	workloadData?: TProjectWorkloadResponse;
	period: TStatsPeriod;
	onPeriodChange: (period: TStatsPeriod) => void;
	isLoading?: boolean;
	isError?: boolean;
	error?: unknown;
}

export const ProjectWorkload = memo(
	({
		workloadData,
		period,
		onPeriodChange,
		isLoading = false,
		isError = false,
		error,
	}: IProjectWorkloadProps) => {
		const [searchTerm, setSearchTerm] = React.useState("");

		const members: Array<TMemberWorkload> = workloadData?.members ?? [];
		const mode = period === "weekly" ? "week" : "month";

		const mappedMembers = React.useMemo(
			() =>
				members.map((m) => ({
					userId: m.user_id,
					name: m.name,
					avatar_url: m.avatar_url,
					chartData: m.series.map((p) => ({
						period: p.date, // "YYYY-MM-DD"
						value: p.task_count,
					})),
				})),
			[members],
		);

		// YAxis ticks chung — tránh duplicate khi globalMax nhỏ
		const allValues = mappedMembers.flatMap((m) =>
			m.chartData.map((p) => p.value),
		);
		const globalMax = Math.max(1, ...allValues);
		const yTicks = React.useMemo(() => {
			if (globalMax === 1) return [0, 1];
			const mid = Math.ceil(globalMax / 2);
			return mid === globalMax ? [0, globalMax] : [0, mid, globalMax];
		}, [globalMax]);

		const filteredMembers = mappedMembers.filter((m) =>
			m.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		return (
			<Card>
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="flex min-w-0 items-center gap-2">
							<CardTitle className="shrink-0">Member workloads</CardTitle>
							<InputGroup>
								<InputGroupAddon align="inline-start">
									<Search className="size-3.5" />
								</InputGroupAddon>
								<InputGroupInput
									placeholder="Search members"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="text-xs"
								/>
							</InputGroup>
						</div>
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
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex flex-col gap-4">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-28 w-full rounded-lg" />
							))}
						</div>
					) : isError ? (
						<Alert variant="destructive">
							<TriangleAlertIcon className="size-4" />
							<AlertTitle>Error loading workload data</AlertTitle>
							<AlertDescription>
								{getErrorMessage(
									error,
									"An error occurred while fetching the member workload statistics.",
								)}
							</AlertDescription>
						</Alert>
					) : (
						<ScrollArea className="h-96 w-full">
							<div className="flex flex-col divide-y">
								{filteredMembers.length > 0 ? (
									filteredMembers.map((m, idx) => (
										<div
											key={m.userId ?? idx}
											className="flex items-center gap-2 py-2"
										>
											<div className="min-w-24">
												<div className="text-sm font-medium">{m.name}</div>
												<div className="text-xs text-muted-foreground">
													Team member
												</div>
											</div>
											<div className="flex-1">
												<ChartContainer
													id={`workload-chart-${idx}`}
													className="aspect-auto"
													config={{
														value: {
															label: "Tasks done",
															color: "var(--chart-1)",
														},
													}}
													style={{ height: 112 }}
												>
													<LineChart
														data={m.chartData}
														margin={{ left: 0, right: 12, top: 8, bottom: 8 }}
													>
														<CartesianGrid
															vertical={false}
															strokeDasharray="3 3"
														/>
														<XAxis
															dataKey="period"
															tickLine={false}
															axisLine={false}
															// Giảm số tick hiển thị tránh chồng chéo
															interval={mode === "week" ? 0 : 4}
															tickFormatter={(v) => {
																try {
																	const d = parseDateStr(v);
																	if (mode === "week") {
																		return d.toLocaleDateString(undefined, {
																			weekday: "short",
																		});
																	}
																	return String(d.getDate()).padStart(2, "0");
																} catch {
																	return String(v);
																}
															}}
														/>
														<YAxis
															width={32}
															axisLine={false}
															tickLine={false}
															allowDecimals={false}
															domain={[0, globalMax]}
															ticks={yTicks}
														/>
														<ChartTooltip
															content={
																<ChartTooltipContent
																	labelKey="period"
																	nameKey="value"
																	indicator="dot"
																	labelFormatter={(label) => {
																		try {
																			return parseDateStr(
																				label,
																			).toLocaleDateString("vi-VN", {
																				day: "2-digit",
																				month: "2-digit",
																				year: "numeric",
																			});
																		} catch {
																			return label;
																		}
																	}}
																/>
															}
														/>
														<Line
															dataKey="value"
															stroke="var(--chart-1)"
															strokeWidth={2}
															dot={false}
															activeDot={{ r: 4 }}
														/>
													</LineChart>
												</ChartContainer>
											</div>
										</div>
									))
								) : (
									<Empty>
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<Search className="size-4" />
											</EmptyMedia>
											<EmptyTitle>
												{members.length === 0
													? "No data for this period"
													: "No team members found"}
											</EmptyTitle>
											<EmptyDescription>
												{members.length === 0
													? "Members haven't been assigned tasks yet."
													: "Try adjusting your search to find what you're looking for."}
											</EmptyDescription>
										</EmptyHeader>
										<EmptyContent>
											{members.length === 0
												? "Assign tasks to members to populate this chart."
												: "Clear the search term to show all members again."}
										</EmptyContent>
									</Empty>
								)}
							</div>
						</ScrollArea>
					)}
				</CardContent>
			</Card>
		);
	},
);

ProjectWorkload.displayName = "ProjectWorkload";

export default ProjectWorkload;
