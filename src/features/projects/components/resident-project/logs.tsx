import {
	IconCheck,
	IconClock,
	IconEdit,
	IconHistory,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TAnnotationEvent, TAnnotationSourceFilter } from "../../schemas";
import {
	CardTitleWithIcon,
	FilterButton,
	formatPercent,
	type ProjectDetailProps,
	ReadOnlyFact,
	SourceBadge,
	sourceToFilter,
} from "./shared";

export function ResidentAnnotationLogs({ project }: ProjectDetailProps) {
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
						Review event labels, how each label was produced, and what still
						needs correction.
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

function AnnotationLogCard({ event }: { event: TAnnotationEvent }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<span className="flex items-center gap-2">
						<IconHistory className="size-4 text-muted-foreground" />
						<span>{event.title}</span>
					</span>
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
						{event.slotsFilled}/{event.slotsTotal} labels
					</Badge>
					{event.confidence !== undefined && (
						<Badge variant="outline">
							{formatPercent(event.confidence * 100)} confidence
						</Badge>
					)}
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					<ReadOnlyFact
						icon={IconHistory}
						label="Bot question"
						value={event.question ?? "Auto-resolved, no question asked"}
					/>
					<ReadOnlyFact
						icon={IconEdit}
						label="Resident response / label"
						value={event.response ?? "Pending resident input"}
					/>
				</div>
				<div className="rounded-lg border">
					<div className="px-4 py-3">
						<CardTitleWithIcon icon={IconCheck}>Label fields</CardTitleWithIcon>
					</div>
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
				</div>
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
