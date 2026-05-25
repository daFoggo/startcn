import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight, Circle } from "lucide-react";
import { TaskPriorityBadge } from "@/components/common/task-priority-badge";
import { TaskTypeBadge } from "@/components/common/task-type-badge";
import { cn } from "@/lib/utils";
import type { TTask } from "../../schemas";

interface ITaskItemProps {
	task: Partial<TTask>;
}

export const TaskItem = ({ task }: ITaskItemProps) => {
	const navigate = useNavigate();
	const { teamId } = useParams({ strict: false });

	return (
		<div
			onClick={() => {
				if (!task.id) return;
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/tasks/$taskId",
					params: {
						teamId: teamId || "personal",
						projectId: task.project_id || "all",
						taskId: task.id,
					},
				});
			}}
			className="group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all hover:bg-muted/80"
		>
			<div className="relative flex size-4 shrink-0 items-center justify-center">
				<Circle className="absolute size-4 text-muted-foreground/60 transition-all group-hover:scale-0 group-hover:opacity-0" />
				<ArrowRight className="absolute size-4 scale-0 text-primary opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
			</div>
			<div className="flex min-w-0 flex-1 items-center justify-between gap-4">
				<span className="truncate text-sm font-medium transition-colors group-hover:text-foreground">
					{task.title}
				</span>
				<div className="flex shrink-0 items-center gap-2">
					{(() => {
						const typeObj = task?.type;
						const typeName =
							typeof typeObj === "object" ? typeObj.name : typeObj;
						const typeColor =
							typeof typeObj === "object" ? typeObj.color : task?.type_color;

						const priorityObj = task?.priority;
						const priorityName =
							typeof priorityObj === "object" ? priorityObj.name : priorityObj;
						const priorityColor =
							typeof priorityObj === "object"
								? priorityObj.color
								: task?.priority_color;

						return (
							<>
								{typeName && (
									<TaskTypeBadge name={typeName} color={typeColor} />
								)}
								{priorityName && (
									<TaskPriorityBadge
										name={priorityName}
										color={priorityColor}
									/>
								)}
							</>
						);
					})()}
					<span
						className={cn(
							"min-w-16 text-right text-xs font-medium transition-colors",
							task.status_id === "overdue"
								? "text-destructive"
								: "text-muted-foreground group-hover:text-foreground/70",
						)}
					>
						{task.due_date
							? format(new Date(task.due_date), "EEE, MMM d")
							: "No date"}
					</span>
				</div>
			</div>
		</div>
	);
};
