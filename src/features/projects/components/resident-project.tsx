import {
	IconAlertCircle,
	IconArrowRight,
	IconBolt,
	IconCalendar,
	IconCheck,
	IconChevronDown,
	IconClock,
	IconDeviceMobile,
	IconDroplet,
	IconEdit,
	IconGauge,
	IconHome,
	IconInfoCircle,
	IconMessageCircle,
	IconMessageQuestion,
	IconRefresh,
	IconRouter,
	IconShieldLock,
	IconSparkles,
	IconTemperature,
	IconUserCheck,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useMemo, useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceArea,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/radix-switch";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useProjectMutations } from "../queries";
import type {
	TAnnotationEvent,
	TAnnotationSource,
	TAnnotationSourceFilter,
	TBuildingActivityWindow,
	TConnectedDevice,
	TPendingQuestion,
	TProjectDetail,
} from "../schemas";

const sourceLabels: Record<TAnnotationSource, string> = {
	YOU_SAID: "YOU SAID",
	BOT_INFERRED: "BOT INFERRED",
	SENSOR_AUTO: "SENSOR AUTO",
	CALENDAR: "CALENDAR",
	PENDING: "PENDING",
	LATER: "LATER",
};

const sourceVariants: Record<
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

const sourceToFilter = (
	source: TAnnotationSource,
): Exclude<TAnnotationSourceFilter, "all"> => {
	if (source === "YOU_SAID") return "YOU";
	if (source === "PENDING" || source === "LATER") return "PENDING";
	return "AUTO";
};

const formatPercent = (value: number) => `${Math.round(value)}%`;

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

interface IProjectDetailProps {
	project: TProjectDetail;
}

export function ResidentProjectDashboard({ project }: IProjectDetailProps) {
	const firstPending = project.pendingQuestions[0];

	return (
		<div className="flex flex-col gap-8">
			<section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
				<Card className="bg-muted/30">
					<CardHeader>
						<CardTitle>Today across all activities</CardTitle>
						<CardDescription>
							Auto-labelled events stay visible here without becoming extra
							questions.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						<OverviewMetric
							icon={IconBolt}
							label="Total events"
							value={project.stats.totalEventsToday}
						/>
						<OverviewMetric
							icon={IconSparkles}
							label="Auto"
							value={project.stats.autoResolvedEvents}
						/>
						<OverviewMetric
							icon={IconUserCheck}
							label="You"
							value={project.stats.userResolvedEvents}
						/>
						<OverviewMetric
							icon={IconMessageQuestion}
							label="Pending"
							value={project.stats.pendingQuestions}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Coverage</CardTitle>
						<CardDescription>
							Required slots filled across the active project.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex items-end justify-between gap-4">
							<p className="text-4xl font-semibold">
								{formatPercent(project.stats.coverage)}
							</p>
							<Badge
								variant={project.status === "active" ? "default" : "outline"}
							>
								{project.status === "active" ? "Active" : "Ended"}
							</Badge>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary"
								style={{ width: `${project.stats.coverage}%` }}
							/>
						</div>
					</CardContent>
				</Card>
			</section>

			<RealTimeBuildingContext project={project} />

			{firstPending && (
				<PendingQuestionPanel
					projectId={project.id}
					question={firstPending}
					priority
				/>
			)}

			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-base font-medium">Activities</h2>
					<p className="text-sm text-muted-foreground">
						Each activity keeps its own stats and recent event trail.
					</p>
				</div>

				<div className="grid gap-4">
					{project.activities.map((activity) => {
						const activityEvents = project.recentEvents
							.filter((event) => event.activityId === activity.id)
							.slice(0, 4);

						return (
							<Card key={activity.id}>
								<CardHeader>
									<CardTitle>{activity.name}</CardTitle>
									<CardDescription>{activity.description}</CardDescription>
									<CardAction>
										<Button
											variant="outline"
											size="sm"
											render={
												<Link
													to="/dashboard/projects/$projectId/annotation"
													params={{ projectId: project.id }}
												/>
											}
										>
											<span>View logs</span>
											<IconArrowRight data-icon="inline-end" />
										</Button>
									</CardAction>
								</CardHeader>
								<CardContent className="flex flex-col gap-4">
									<div className="grid gap-3 md:grid-cols-3">
										{activity.stats.map((stat) => (
											<div
												key={stat.label}
												className="rounded-lg border bg-background px-4 py-3"
											>
												<p className="text-xs text-muted-foreground">
													{stat.label}
												</p>
												<p className="mt-1 text-lg font-semibold">
													{stat.value}
												</p>
												{stat.helper && (
													<p className="mt-1 text-xs text-muted-foreground">
														{stat.helper}
													</p>
												)}
											</div>
										))}
									</div>

									<div className="rounded-lg border">
										{activityEvents.length > 0 ? (
											activityEvents.map((event) => (
												<EventTimelineRow key={event.id} event={event} />
											))
										) : (
											<p className="px-4 py-3 text-sm text-muted-foreground">
												No resident-visible events for this activity yet.
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
		</div>
	);
}

export function ResidentProjectConfiguration({ project }: IProjectDetailProps) {
	return (
		<div className="flex flex-col gap-8">
			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-base font-medium">Researcher-defined</h2>
					<p className="text-sm text-muted-foreground">
						This describes what the study is collecting. Residents can review it
						but not edit the research schema.
					</p>
				</div>

				<div className="grid gap-4">
					{project.activities.map((activity) => (
						<Card key={activity.id}>
							<CardHeader>
								<CardTitle>{activity.name}</CardTitle>
								<CardDescription>{activity.description}</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
								<div className="grid gap-3">
									<ReadOnlyFact label="What" value={activity.what} />
									<ReadOnlyFact label="Where" value={activity.where} />
									<ReadOnlyFact label="When" value={activity.when} />
									<ReadOnlyFact label="Who" value={activity.who} />
								</div>
								<div className="rounded-lg border">
									{activity.slots.map((slot) => (
										<div
											key={slot.name}
											className="border-b px-4 py-3 last:border-b-0"
										>
											<div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
												<p className="font-medium">{slot.name}</p>
												<Badge variant="outline">{slot.labelSpace}</Badge>
											</div>
											<p className="mt-2 text-sm text-muted-foreground">
												{slot.sourcePolicy}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
				<Card>
					<CardHeader>
						<CardTitle>Privacy policy</CardTitle>
						<CardDescription>{project.privacyPolicy.summary}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<div className="flex flex-wrap gap-2">
							{project.privacyPolicy.quotableSensors.map((sensor) => (
								<Badge key={sensor} variant="outline">
									{sensor}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quiet hours and budget</CardTitle>
						<CardDescription>
							These resident controls limit interruption without changing the
							researcher's schema.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid grid-cols-2 gap-3">
							<label
								className="flex flex-col gap-1"
								htmlFor="quiet-hours-start"
							>
								<span className="text-xs text-muted-foreground">Starts</span>
								<Input
									id="quiet-hours-start"
									readOnly
									value={project.overrides.quietHoursStart}
								/>
							</label>
							<label className="flex flex-col gap-1" htmlFor="quiet-hours-end">
								<span className="text-xs text-muted-foreground">Ends</span>
								<Input
									id="quiet-hours-end"
									readOnly
									value={project.overrides.quietHoursEnd}
								/>
							</label>
						</div>
						<label className="flex flex-col gap-2">
							<span className="text-xs text-muted-foreground">
								Daily question limit: {project.overrides.dailyQuestionLimit}
							</span>
							<input
								aria-label="Daily question limit"
								className="accent-primary"
								max={10}
								min={0}
								readOnly
								type="range"
								value={project.overrides.dailyQuestionLimit}
							/>
						</label>
					</CardContent>
				</Card>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Scenario overrides</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{project.overrides.scenarios.map((scenario) => (
							<div
								key={scenario.id}
								className="flex items-center gap-3 rounded-lg border px-4 py-3"
							>
								<div className="min-w-0 flex-1">
									<p className="font-medium">{scenario.name}</p>
									<p className="text-xs text-muted-foreground">
										{scenario.description}
									</p>
								</div>
								<Switch
									aria-label={scenario.name}
									defaultChecked={scenario.enabled}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Member routing</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{project.overrides.memberRouting.map((pattern) => (
							<div
								key={pattern.activityId}
								className="rounded-lg border px-4 py-3"
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="font-medium">{pattern.activityName}</p>
										<p className="text-xs text-muted-foreground">
											Usually asks {pattern.primaryMember}
										</p>
									</div>
									<Badge variant="outline">{pattern.confidence}%</Badge>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									{pattern.note}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</section>
		</div>
	);
}

export function ResidentProjectSensors({ project }: IProjectDetailProps) {
	return (
		<div className="flex flex-col gap-8">
			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-base font-medium">Connected sensors</h2>
					<p className="text-sm text-muted-foreground">
						Manage the building data sources that feed AnnoBot context and
						auto-labelling.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
					<div className="grid gap-4">
						{project.overrides.connectedDevices.map((device) => (
							<SensorCard device={device} key={device.id} />
						))}
					</div>

					<div className="flex flex-col gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Sensor actions</CardTitle>
								<CardDescription>
									Add sources or refresh metadata without changing research
									activity definitions.
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
								<CardTitle>Connection rules</CardTitle>
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

export function ResidentAnnotationLogs({ project }: IProjectDetailProps) {
	const [activityId, setActivityId] = useState("all");
	const [source, setSource] = useState<TAnnotationSourceFilter>("all");

	const filteredEvents = useMemo(
		() =>
			project.recentEvents.filter((event) => {
				const activityMatches =
					activityId === "all" || event.activityId === activityId;
				const sourceMatches =
					source === "all" || sourceToFilter(event.source) === source;
				return activityMatches && sourceMatches;
			}),
		[activityId, project.recentEvents, source],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-col gap-1">
					<h2 className="text-base font-medium">Annotation logs</h2>
					<p className="text-sm text-muted-foreground">
						Review labels, provenance, pending slots, and corrections.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<FilterButton
						active={activityId === "all"}
						onClick={() => setActivityId("all")}
					>
						All activities
					</FilterButton>
					{project.activities.map((activity) => (
						<FilterButton
							active={activityId === activity.id}
							key={activity.id}
							onClick={() => setActivityId(activity.id)}
						>
							{activity.name}
						</FilterButton>
					))}
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{(["all", "YOU", "AUTO", "PENDING"] as const).map((option) => (
					<FilterButton
						active={source === option}
						key={option}
						onClick={() => setSource(option)}
					>
						{option === "all" ? "All sources" : option}
					</FilterButton>
				))}
			</div>

			<div className="grid gap-4">
				{filteredEvents.map((event) => (
					<AnnotationLogCard key={event.id} event={event} />
				))}

				{filteredEvents.length === 0 && (
					<Card>
						<CardContent className="py-6">
							<p className="text-sm text-muted-foreground">
								No logs match this filter.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

export function ResidentAboutProject({ project }: IProjectDetailProps) {
	return (
		<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>{project.name}</CardTitle>
						<CardDescription>{project.description}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="grid gap-3 md:grid-cols-2">
							<AboutFact
								icon={IconHome}
								label="Research unit"
								value={project.organization.name}
							/>
							<AboutFact
								icon={IconCalendar}
								label="Study timeline"
								value={project.studyTimeline}
							/>
							<AboutFact
								icon={IconUsers}
								label="Household"
								value={`${project.householdName} - ${project.members.join(", ")}`}
							/>
							<AboutFact
								icon={IconShieldLock}
								label="Participation"
								value={project.status === "active" ? "Active" : "Ended"}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Research goals</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-3">
							{project.goals.map((goal) => (
								<li className="flex gap-3" key={goal}>
									<IconCheck className="mt-1 size-4 shrink-0 text-primary" />
									<span>{goal}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Full privacy policy</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-3">
							{project.privacyPolicy.fullPolicy.map((item) => (
								<li className="flex gap-3" key={item}>
									<IconInfoCircle className="mt-1 size-4 shrink-0 text-muted-foreground" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Tracked activities</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{project.activities.map((activity) => (
							<div key={activity.id} className="rounded-lg border px-4 py-3">
								<p className="font-medium">{activity.name}</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{activity.description}
								</p>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Leave project</CardTitle>
						<CardDescription>
							Leaving stops new resident prompts for this study.
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<AlertDialog>
							<AlertDialogTrigger render={<Button variant="destructive" />}>
								<IconX data-icon="inline-start" />
								<span>Leave project</span>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogMedia>
										<IconAlertCircle />
									</AlertDialogMedia>
									<AlertDialogTitle>Leave this project?</AlertDialogTitle>
									<AlertDialogDescription>
										You will stop receiving new AnnoBot questions for this
										project. Existing labels remain in the study audit log.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction variant="destructive">
										Leave project
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

function RealTimeBuildingContext({ project }: IProjectDetailProps) {
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
						<div>
							<div className="flex items-center gap-2">
								<span className="flex size-2 rounded-full bg-primary" />
								<CardTitle>Home activity timeline</CardTitle>
							</div>
						</div>
						<p className="text-xs font-medium text-muted-foreground">
							{context.liveAt}
						</p>
					</div>
				</CardHeader>
				<CardContent className="grid gap-3 lg:grid-cols-[20rem_1fr]">
					<div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
						{context.metrics.map((metric) => (
							<div className="rounded-lg border px-3 py-2" key={metric.label}>
								<p className="text-xs text-muted-foreground">{metric.label}</p>
								<p className="mt-1 text-base font-semibold">{metric.value}</p>
								{metric.helper && (
									<p className="mt-1 text-xs text-muted-foreground">
										{metric.helper}
									</p>
								)}
							</div>
						))}
					</div>

					<div className="flex flex-col gap-3">
						<div className="rounded-lg border px-3 py-2">
							<div className="flex items-center justify-between gap-3">
								<div className="flex flex-col gap-0.5">
									<p className="text-sm font-medium">
										Sensor timeline and activity windows
									</p>
									<p className="text-xs text-muted-foreground">
										Colored spans show when AnnoBot thinks an activity happened.
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

						<p className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
							{context.learningSummary}
						</p>
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
			<div className="relative">
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
			</div>

			<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<span className="size-2 rounded-full bg-[var(--chart-1)]" />
					<span>Whole-house load, kW</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="size-2 rounded-full bg-[var(--chart-5)]" />
					<span>Hot-water flow, L/min</span>
				</div>
			</div>

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
							<div className="flex items-center gap-2">
								<span
									className="size-2 rounded-full"
									style={{
										backgroundColor: activityWindowColors[span.colorKey],
									}}
								/>
								<p
									className="text-xs font-semibold"
									style={{ color: activityWindowColors[span.colorKey] }}
								>
									{span.label}
								</p>
							</div>
							<p className="mt-1 text-xs text-muted-foreground">
								{span.start} - {span.end}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function SensorCard({ device }: { device: TConnectedDevice }) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start gap-3">
					<div className="flex min-w-0 items-start gap-3">
						<SensorIcon type={device.type} />
						<div className="min-w-0">
							<CardTitle>{device.name}</CardTitle>
							<CardDescription>
								{device.type} - {device.location ?? "Whole home"}
							</CardDescription>
						</div>
					</div>
					<div className="ml-auto flex shrink-0 items-center gap-2">
						<Badge
							variant={
								device.status === "connected" ? "outline" : "destructive"
							}
						>
							{device.status}
						</Badge>
						<Button
							aria-label={`Refresh ${device.name}`}
							size="icon-sm"
							variant="ghost"
						>
							<IconRefresh />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="grid gap-3 md:grid-cols-4">
				<SensorFact label="Location" value={device.location ?? "Whole home"} />
				<SensorFact label="Current reading" value={device.reading ?? "Idle"} />
				<SensorFact label="Latency" value={device.latency ?? "Unknown"} />
				<SensorFact label="Health" value={device.detail} />
			</CardContent>
		</Card>
	);
}

function SensorIcon({ type }: { type: string }) {
	const normalizedType = type.toLowerCase();
	const Icon = normalizedType.includes("water")
		? IconDroplet
		: normalizedType.includes("presence")
			? IconRouter
			: normalizedType.includes("environment")
				? IconTemperature
				: IconGauge;

	return <Icon className="mt-1 size-5 shrink-0 text-muted-foreground" />;
}

function SensorFact({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border bg-muted/30 px-4 py-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="mt-1 text-sm font-medium">{value}</p>
		</div>
	);
}

function PendingQuestionPanel({
	priority,
	projectId,
	question,
}: {
	priority?: boolean;
	projectId: string;
	question: TPendingQuestion;
}) {
	const [answer, setAnswer] = useState(question.quickActions[0] ?? "");
	const [isResolved, setIsResolved] = useState(false);
	const { submitAnnotationAnswer } = useProjectMutations();
	const freeTextId = `${question.id}-free-text-answer`;

	if (isResolved) return null;

	const handleSubmit = async () => {
		try {
			const response = await submitAnnotationAnswer.mutateAsync({
				answer,
				projectId,
				questionId: question.id,
			});
			setIsResolved(true);
			toast.success(response.message);
		} catch (error) {
			toast.error(getErrorMessage(error, "Could not save annotation."));
		}
	};

	return (
		<Card className={cn(priority && "ring-primary/30")}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconMessageCircle className="size-4 text-primary" />
					<span>Pending question</span>
				</CardTitle>
				<CardDescription>{question.context}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<p className="text-base font-medium">{question.question}</p>
				<div className="flex flex-wrap gap-2">
					{question.quickActions.map((action) => (
						<Button
							key={action}
							onClick={() => setAnswer(action)}
							variant={answer === action ? "default" : "outline"}
						>
							{action}
						</Button>
					))}
				</div>
				<label className="flex flex-col gap-1" htmlFor={freeTextId}>
					<span className="text-xs text-muted-foreground">
						Free-text answer
					</span>
					<Textarea
						id={freeTextId}
						onChange={(event) => setAnswer(event.target.value)}
						value={answer}
					/>
				</label>
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<p className="text-sm text-muted-foreground">
						Not you? Redirect choices: {question.canRedirectMembers.join(", ")}
					</p>
					<Button
						disabled={submitAnnotationAnswer.isPending || !answer.trim()}
						onClick={handleSubmit}
					>
						<IconCheck data-icon="inline-start" />
						<span>
							{submitAnnotationAnswer.isPending ? "Saving" : "Save answer"}
						</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function OverviewMetric({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof IconBolt;
	label: string;
	value: number;
}) {
	return (
		<div className="rounded-lg border bg-background px-4 py-3">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Icon className="size-4" />
				<span>{label}</span>
			</div>
			<p className="mt-2 text-2xl font-semibold">{value}</p>
		</div>
	);
}

function EventTimelineRow({ event }: { event: TAnnotationEvent }) {
	return (
		<div className="grid gap-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[8rem_1fr_auto] md:items-center">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<IconClock className="size-4" />
				<span>{event.timestamp}</span>
			</div>
			<div className="min-w-0">
				<p className="font-medium">{event.title}</p>
				<p className="mt-1 truncate text-xs text-muted-foreground">
					{event.context}
				</p>
			</div>
			<SourceBadge source={event.source} />
		</div>
	);
}

function AnnotationLogCard({ event }: { event: TAnnotationEvent }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<span>{event.title}</span>
					<SourceBadge source={event.source} />
				</CardTitle>
				<CardDescription>
					{event.timestamp} - {event.activityName}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-wrap gap-2">
					<Badge variant="outline">{event.context}</Badge>
					<Badge variant="outline">
						{event.slotsFilled}/{event.slotsTotal} slots
					</Badge>
					{event.confidence !== undefined && (
						<Badge variant="outline">
							{formatPercent(event.confidence * 100)} confidence
						</Badge>
					)}
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					<ReadOnlyFact
						label="Bot question"
						value={event.question ?? "Auto-resolved, no question asked"}
					/>
					<ReadOnlyFact
						label="Resident response / label"
						value={event.response ?? "Pending resident input"}
					/>
				</div>
				<details className="rounded-lg border">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
						<span className="font-medium">Slot checklist</span>
						<IconChevronDown className="size-4 text-muted-foreground" />
					</summary>
					<div className="border-t">
						{event.slots.map((slot) => (
							<div
								key={`${event.id}-${slot.name}`}
								className="grid gap-2 border-b px-4 py-3 last:border-b-0 md:grid-cols-[1fr_1fr_auto] md:items-center"
							>
								<div className="flex items-center gap-2">
									{slot.filled ? (
										<IconCheck className="size-4 text-primary" />
									) : (
										<IconClock className="size-4 text-muted-foreground" />
									)}
									<span className="font-medium">{slot.name}</span>
								</div>
								<p className="text-sm text-muted-foreground">{slot.value}</p>
								<SourceBadge source={slot.source} />
							</div>
						))}
					</div>
				</details>
			</CardContent>
			<CardFooter className="justify-end">
				<Button variant="outline">
					<IconEdit data-icon="inline-start" />
					<span>Edit correction</span>
				</Button>
			</CardFooter>
		</Card>
	);
}

function ReadOnlyFact({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border bg-background px-4 py-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="mt-1 text-sm">{value}</p>
		</div>
	);
}

function FilterButton({
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

function SourceBadge({ source }: { source: TAnnotationSource }) {
	return <Badge variant={sourceVariants[source]}>{sourceLabels[source]}</Badge>;
}

function AboutFact({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof IconHome;
	label: string;
	value: string;
}) {
	return (
		<div className="flex gap-3 rounded-lg border px-4 py-3">
			<Icon className="mt-1 size-4 text-muted-foreground" />
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="mt-1 text-sm font-medium">{value}</p>
			</div>
		</div>
	);
}
