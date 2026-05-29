import {
	IconArrowRight,
	IconBolt,
	IconCalendarStats,
	IconChartBar,
	IconCheck,
	IconClock,
	IconHomeStats,
	IconMessageQuestion,
	IconSparkles,
	IconUserCheck,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
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
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TAnnotationEvent, TResidentActivity } from "../../schemas";
import { RealTimeBuildingContext } from "./building-context";
import { PendingQuestionPanel } from "./pending-question-panel";
import {
	CardTitleWithIcon,
	CompletionBar,
	formatPercent,
	type ProjectDetailProps,
	SourceBadge,
} from "./shared";

export function ResidentProjectDashboard({ project }: ProjectDetailProps) {
	const firstPending = project.pendingQuestions[0];

	return (
		<div className="flex flex-col gap-8">
			<section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
				<Card className="bg-muted/30">
					<CardHeader>
						<CardTitleWithIcon icon={IconHomeStats}>
							Today across all activities
						</CardTitleWithIcon>
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
						<CardTitleWithIcon icon={IconChartBar}>Coverage</CardTitleWithIcon>
						<CardDescription>
							Required label fields completed across the active project.
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
						<CompletionBar value={project.stats.coverage} />
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
						Each activity shows today's summary and the latest events you can
						review.
					</p>
				</div>

				<div className="grid gap-4">
					{project.activities.map((activity) => {
						const activityEvents = project.recentEvents
							.filter((event) => event.activityId === activity.id)
							.slice(0, 5);

						return (
							<ActivityEvidencePanel
								activity={activity}
								events={activityEvents}
								key={activity.id}
								projectId={project.id}
							/>
						);
					})}
				</div>
			</section>
		</div>
	);
}

function ActivityEvidencePanel({
	activity,
	events,
	projectId,
}: {
	activity: TResidentActivity;
	events: Array<TAnnotationEvent>;
	projectId: string;
}) {
	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitleWithIcon icon={IconCalendarStats}>
					{activity.name}
				</CardTitleWithIcon>
				<CardDescription>{activity.description}</CardDescription>
				<CardAction className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						render={
							<Link
								to="/dashboard/projects/$projectId/annotation"
								params={{ projectId }}
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
						<div key={stat.label} className="rounded-lg border px-4 py-3">
							<p className="text-xs text-muted-foreground">{stat.label}</p>
							<p className="mt-1 text-lg font-semibold">{stat.value}</p>
							{stat.helper && (
								<p className="mt-1 text-xs text-muted-foreground">
									{stat.helper}
								</p>
							)}
						</div>
					))}
				</div>

				<ActivityEventTimeline events={events} projectId={projectId} />
			</CardContent>
		</Card>
	);
}

function ActivityEventTimeline({
	events,
	projectId,
}: {
	events: Array<TAnnotationEvent>;
	projectId: string;
}) {
	if (events.length === 0) {
		return (
			<p className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
				No resident-visible events for this activity yet.
			</p>
		);
	}

	return (
		<div className="rounded-lg border">
			<div className="border-b px-4 py-3">
				<p className="font-medium">Recent events</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Click an event to review or correct it.
				</p>
			</div>
			{events.map((event) => (
				<EventReviewDialog event={event} key={event.id} projectId={projectId}>
					<div className="grid gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/30 md:grid-cols-[8rem_1fr_auto] md:items-center">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<IconClock className="size-4" />
							<span>{event.timestamp}</span>
						</div>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2">
								<p className="font-medium">{event.title}</p>
								<SourceBadgeWithTooltip source={event.source} />
							</div>
							<p className="mt-1 text-sm text-muted-foreground">
								{event.context}
							</p>
						</div>
						<LabelFieldsTooltip
							filled={event.slotsFilled}
							total={event.slotsTotal}
						/>
					</div>
				</EventReviewDialog>
			))}
		</div>
	);
}

function EventReviewDialog({
	children,
	event,
	projectId,
}: {
	children: React.ReactNode;
	event: TAnnotationEvent;
	projectId: string;
}) {
	const [answer, setAnswer] = useState(event.response ?? "");
	const answerId = `${event.id}-dashboard-answer`;
	const quickActions = getEventQuickActions(event);

	const handleSave = () => {
		toast.success("Saved review in this mock dashboard.");
	};

	return (
		<Dialog>
			<DialogTrigger render={<button className="block w-full" type="button" />}>
				{children}
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{event.title}</DialogTitle>
					<DialogDescription>{event.context}</DialogDescription>
				</DialogHeader>

				<div className="flex flex-wrap gap-2">
					<SourceBadge source={event.source} />
					<Badge variant="outline">
						{event.slotsFilled}/{event.slotsTotal} labels completed
					</Badge>
					{event.confidence !== undefined && (
						<Badge variant="outline">
							{formatPercent(event.confidence * 100)} confidence
						</Badge>
					)}
				</div>

				<div className="rounded-lg border bg-muted/20 px-4 py-3">
					<p className="text-xs text-muted-foreground">Bot question</p>
					<p className="mt-1 text-sm font-medium">
						{event.question ?? "Auto-resolved, no question asked"}
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{quickActions.map((action) => (
						<Button
							key={action}
							onClick={() => setAnswer(action)}
							variant={answer === action ? "default" : "outline"}
						>
							{action}
						</Button>
					))}
				</div>

				<label className="flex flex-col gap-1" htmlFor={answerId}>
					<span className="text-xs text-muted-foreground">
						Resident answer or correction
					</span>
					<Textarea
						id={answerId}
						onChange={(inputEvent) => setAnswer(inputEvent.target.value)}
						placeholder="Confirm or correct this event label"
						value={answer}
					/>
				</label>

				<div className="rounded-lg border">
					<div className="border-b px-4 py-3">
						<p className="font-medium">Label fields</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Fields captured for this event. Full audit history stays in logs.
						</p>
					</div>
					{event.slots.map((slot) => (
						<div
							className="grid gap-2 border-b px-4 py-3 last:border-b-0 md:grid-cols-[1fr_1fr_auto] md:items-center"
							key={`${event.id}-${slot.name}`}
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

				<DialogFooter>
					<Button
						variant="outline"
						render={
							<Link
								to="/dashboard/projects/$projectId/annotation"
								params={{ projectId }}
							/>
						}
					>
						Open full logs
					</Button>
					<Button disabled={!answer.trim()} onClick={handleSave}>
						<IconCheck data-icon="inline-start" />
						<span>Save review</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function getEventQuickActions(event: TAnnotationEvent) {
	const question = event.question?.toLowerCase() ?? "";
	const activity = event.activityName.toLowerCase();

	if (!event.question) {
		return ["Confirm label", "Needs correction"];
	}

	const contextualActions = question.includes("who")
		? ["Me", "Another household member", "Not sure"]
		: question.includes("appliance") || activity.includes("cooking")
			? ["Kettle", "Oven", "Dishwasher", "Other"]
			: activity.includes("laundry")
				? ["Washer", "Dryer", "Both", "Not laundry"]
				: activity.includes("comfort") || question.includes("comfortable")
					? ["Comfortable", "Too warm", "Too cold", "Skip"]
					: ["Yes", "No", "Not sure"];

	return Array.from(
		new Set([event.response, ...contextualActions].filter(Boolean)),
	) as Array<string>;
}

function SourceBadgeWithTooltip({
	source,
}: {
	source: TAnnotationEvent["source"];
}) {
	return (
		<Tooltip>
			<TooltipTrigger render={<span className="inline-flex" />}>
				<SourceBadge source={source} />
			</TooltipTrigger>
			<TooltipContent>
				How this label was produced: resident answer, sensor automation, model
				inference, calendar context, pending, or deferred.
			</TooltipContent>
		</Tooltip>
	);
}

function LabelFieldsTooltip({
	filled,
	total,
}: {
	filled: number;
	total: number;
}) {
	return (
		<Tooltip>
			<TooltipTrigger render={<span className="inline-flex" />}>
				<Badge variant="outline">
					{filled}/{total} labels
				</Badge>
			</TooltipTrigger>
			<TooltipContent>
				Label fields completed for this event. Click the row to review.
			</TooltipContent>
		</Tooltip>
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
