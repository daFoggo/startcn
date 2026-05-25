import { ListTodo } from "lucide-react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TTask } from "../../schemas";
import { TaskItem } from "./task-item";

interface ITaskListProps {
	tasks: Array<Partial<TTask>>;
}

export const TaskList = ({ tasks }: ITaskListProps) => {
	return (
		<ScrollArea className="h-64">
			<div className="flex flex-col">
				{tasks.length === 0 ? (
					<Empty className="h-full border-none shadow-none">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ListTodo />
							</EmptyMedia>
							<EmptyTitle>No tasks found</EmptyTitle>
							<EmptyDescription>
								You don't have any tasks in this category.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							Move tasks into this lane or create a new task to populate it.
						</EmptyContent>
					</Empty>
				) : (
					tasks.map((task) => <TaskItem key={task.id} task={task} />)
				)}
			</div>
		</ScrollArea>
	);
};
