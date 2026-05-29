import {
	IconCheckbox,
	IconClockQuestion,
	IconMessageQuestion,
	IconSparkles,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TProject, TProjectStats } from "../schemas";

interface IProjectCardProps {
	project: TProject;
	stats?: TProjectStats;
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const ProjectCard = ({ project, stats }: IProjectCardProps) => {
	const coverage = clampPercent(stats?.coverage ?? 0);
	const pendingQuestions = stats?.pendingQuestions ?? 0;
	const autoResolvedEvents = stats?.autoResolvedEvents ?? 0;
	const projectHref = `/dashboard/projects/${project.id}`;

	return (
		<Link
			to={projectHref as any}
			className="block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
		>
			<Card className="min-h-56 transition-colors hover:bg-muted/40 hover:ring-primary/30">
				<CardHeader>
					<CardTitle className="truncate">{project.name}</CardTitle>
					<CardDescription className="truncate">
						{project.organization.name}
					</CardDescription>
					<CardAction>
						<Badge
							variant={project.status === "active" ? "default" : "outline"}
						>
							{project.status === "active" ? "Active" : "Ended"}
						</Badge>
					</CardAction>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					<div className="rounded-lg border bg-background p-3">
						<div className="mb-3 flex items-center justify-between gap-3">
							<div className="flex items-center gap-2 text-sm font-medium">
								<IconCheckbox className="size-4 text-primary" />
								<span>Annotation coverage</span>
							</div>
							<span className="text-sm font-medium">{coverage}%</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary"
								style={{ width: `${coverage}%` }}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<ProjectCardMetric
							icon={IconMessageQuestion}
							label="Pending today"
							value={pendingQuestions}
						/>
						<ProjectCardMetric
							icon={IconSparkles}
							label="Auto-resolved"
							value={autoResolvedEvents}
						/>
						<ProjectCardMetric
							icon={IconClockQuestion}
							label="Events today"
							value={stats?.totalEventsToday ?? 0}
						/>
						<ProjectCardMetric
							icon={IconCheckbox}
							label="You answered"
							value={stats?.userResolvedEvents ?? 0}
						/>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

interface IProjectCardMetricProps {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: number;
}

const ProjectCardMetric = ({
	icon: Icon,
	label,
	value,
}: IProjectCardMetricProps) => {
	return (
		<div className="flex items-start gap-2 rounded-lg border bg-background p-3">
			<Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
			<div className="min-w-0">
				<p className="text-lg font-semibold leading-none">{value}</p>
				<p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
			</div>
		</div>
	);
};
