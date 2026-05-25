import { useNavigate, useParams } from "@tanstack/react-router";
import { CalendarDays, GitBranch, ListTree, Plus } from "lucide-react";
import { TaskPriorityBadge } from "@/components/common/task-priority-badge";
import { TaskStatusBadge } from "@/components/common/task-status-badge";
import { TaskTypeBadge } from "@/components/common/task-type-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCalendarDate } from "../../helpers";
import type { ITaskListDialogOptions, TTask } from "../../schemas";

interface ITaskSubTasksSectionProps {
	task?: TTask;
	options?: ITaskListDialogOptions;
	parentTaskOptions?: TTask[];
	isLoading?: boolean;
	canManageTasks?: boolean;
}

const getOptionById = <T extends { id: string; name: string; color?: string }>(
	items: Array<T>,
	id: string,
) => items.find((item) => item.id === id);

export function TaskSubTasksSection({
	task,
	options,
	parentTaskOptions = [],
	isLoading,
	canManageTasks = true,
}: ITaskSubTasksSectionProps) {
	const navigate = useNavigate();
	const { teamId, projectId } = useParams({ strict: false });

	if (isLoading) return <TaskSubTasksSectionSkeleton />;
	if (!task || !options) return null;

	const subTasks =
		task.sub_tasks && task.sub_tasks.length > 0
			? task.sub_tasks
			: parentTaskOptions.filter((t) => t.parent_id === task.id);
	const targetTeamId = teamId || "personal";
	const targetProjectId = projectId || task.project_id;

	const navigateToCreateSubTask = () => {
		navigate({
			to: "/dashboard/$teamId/projects/$projectId/tasks/create",
			params: {
				teamId: targetTeamId,
				projectId: targetProjectId,
			},
			search: {
				parent_id: task.id,
				parent_task_id: task.id,
				redirect_to: "task",
			} as Record<string, string>,
		});
	};

	const navigateToSubTask = (subTask: TTask) => {
		navigate({
			to: "/dashboard/$teamId/projects/$projectId/tasks/$taskId",
			params: {
				teamId: targetTeamId,
				projectId: subTask.project_id || targetProjectId,
				taskId: subTask.id,
			},
			search: {
				parent_task_id: task.id,
				redirect_to: "task",
			} as Record<string, string>,
		});
	};

	return (
		<section data-slot="task-sub-tasks-section" className="space-y-2">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<ListTree className="size-4 text-muted-foreground" />
					<h2 className="text-sm font-medium">Sub-tasks</h2>
					<Badge variant="secondary">{subTasks.length}</Badge>
				</div>
				{canManageTasks && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={navigateToCreateSubTask}
					>
						<Plus className="size-4" />
						Add sub-task
					</Button>
				)}
			</div>

			{subTasks.length === 0 ? (
				<Empty className="min-h-40 border border-dashed shadow-none">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<GitBranch />
						</EmptyMedia>
						<EmptyTitle>No sub-tasks yet</EmptyTitle>
						<EmptyDescription>
							Break this task into smaller trackable work items.
						</EmptyDescription>
					</EmptyHeader>
					{canManageTasks && (
						<EmptyContent>
							<Button type="button" size="sm" onClick={navigateToCreateSubTask}>
								<Plus className="size-4" />
								Create sub-task
							</Button>
						</EmptyContent>
					)}
				</Empty>
			) : (
				<ItemGroup>
					{subTasks.map((subTask) => {
						const status = getOptionById(options.statuses, subTask.status_id);
						const type = getOptionById(options.types, subTask.type_id);
						const priority = getOptionById(
							options.priorities,
							subTask.priority_id,
						);

						return (
							<Item
								asChild
								key={subTask.id}
								className="cursor-pointer hover:bg-muted/60"
								size="xs"
							>
								<button
									type="button"
									onClick={() => navigateToSubTask(subTask)}
									className="text-left"
								>
									<ItemMedia variant="icon">
										<GitBranch className="text-muted-foreground" />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{subTask.title}</ItemTitle>
										<ItemDescription className="flex flex-wrap items-center gap-2 mt-1">
											<TaskStatusBadge
												name={status?.name || "Unknown"}
												color={status?.color}
												className="max-w-32"
											/>
											{type ? (
												<TaskTypeBadge
													name={type.name}
													color={type.color}
													className="max-w-32"
												/>
											) : null}
											{priority ? (
												<TaskPriorityBadge
													name={priority.name}
													color={priority.color}
													className="max-w-32"
												/>
											) : null}
										</ItemDescription>
									</ItemContent>
									<ItemActions className="hidden text-muted-foreground sm:flex">
										<CalendarDays className="size-3.5" />
										{subTask.due_date
											? formatCalendarDate(new Date(subTask.due_date))
											: "No due date"}
									</ItemActions>
								</button>
							</Item>
						);
					})}
				</ItemGroup>
			)}
		</section>
	);
}

export function TaskSubTasksSectionSkeleton() {
	return (
		<section data-slot="task-sub-tasks-section-skeleton" className="space-y-2">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Skeleton className="size-4" />
					<Skeleton className="h-5 w-24" />
				</div>
				<Skeleton className="h-8 w-28" />
			</div>
			<ItemGroup>
				<Skeleton className="h-14 w-full rounded-lg" />
				<Skeleton className="h-14 w-full rounded-lg" />
				<Skeleton className="h-14 w-full rounded-lg" />
			</ItemGroup>
		</section>
	);
}
