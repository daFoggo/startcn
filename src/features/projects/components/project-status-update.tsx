import { AlertCircle, TriangleAlertIcon } from "lucide-react";
import { memo } from "react";
import { TaskStatusBadge } from "@/components/common/task-status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import type { TTaskActivity } from "../schemas";

function formatDateTime(date?: string | Date | null) {
	if (!date) return "-";
	return new Date(date).toLocaleString(undefined, {
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getStatusTransition(task: TTaskActivity) {
	const from = task.old_status_name ?? "To Do";
	const to = task.new_status_name ?? "Unknown";
	return `${from} → ${to}`;
}

function getLatestStatusColor(task: TTaskActivity) {
	return task.new_status_color ?? task.old_status_color ?? "currentColor";
}

interface IProjectStatusUpdateProps {
	items: TTaskActivity[];
	isLoading?: boolean;
	isError?: boolean;
	error?: unknown;
}

export const ProjectStatusUpdate = memo(
	({
		items,
		isLoading = false,
		isError = false,
		error,
	}: IProjectStatusUpdateProps) => {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recent status updates</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex flex-col gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex items-center justify-between py-2">
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-48" />
										<Skeleton className="h-5 w-24" />
									</div>
									<div className="shrink-0 space-y-2 text-right">
										<Skeleton className="ml-auto h-3 w-28" />
										<Skeleton className="ml-auto h-3 w-16" />
									</div>
								</div>
							))}
						</div>
					) : isError ? (
						<Alert variant="destructive">
							<TriangleAlertIcon className="size-4" />
							<AlertTitle>Error loading updates</AlertTitle>
							<AlertDescription>
								{getErrorMessage(
									error,
									"An error occurred while fetching the recent project status updates.",
								)}
							</AlertDescription>
						</Alert>
					) : (
						<ScrollArea className="h-96 w-full">
							<div className="flex flex-col divide-y">
								{items.length === 0 ? (
									<Empty>
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<AlertCircle className="size-4" />
											</EmptyMedia>
											<EmptyTitle>No updates this week</EmptyTitle>
											<EmptyDescription>
												Tasks haven't been updated yet this week. Check back
												later for status changes.
											</EmptyDescription>
										</EmptyHeader>
									</Empty>
								) : (
									items.map((it) => (
										<div
											key={it.id}
											className="flex items-start justify-between gap-4 py-2"
										>
											<div className="min-w-0 flex-1">
												<div className="truncate font-medium">
													{it.task_title}
												</div>
												<div className="mt-2 flex flex-wrap gap-1.5">
													{it.new_status_name ? (
														<TaskStatusBadge
															name={getStatusTransition(it)}
															color={getLatestStatusColor(it)}
														/>
													) : null}
												</div>
											</div>
											<div className="shrink-0 text-right text-xs text-muted-foreground">
												<div className="font-medium text-foreground">
													Updated by {it.user_name}
												</div>
												<div>{formatDateTime(it.created_at)}</div>
											</div>
										</div>
									))
								)}
							</div>
						</ScrollArea>
					)}
				</CardContent>
			</Card>
		);
	},
);

ProjectStatusUpdate.displayName = "ProjectStatusUpdate";

export default ProjectStatusUpdate;
