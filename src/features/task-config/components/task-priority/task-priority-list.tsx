import { Inbox, Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type { TTaskPriority } from "../../schemas";
import { CreateTaskPriorityDialog } from "./create-task-priority-dialog";
import { taskPriorityColumns } from "./task-priority-columns";

interface ITaskPriorityListProps {
	projectId: string;
	priorities: TTaskPriority[];
	canManageProject?: boolean;
}

export const TaskPriorityList = ({
	projectId,
	priorities,
	canManageProject = true,
}: ITaskPriorityListProps) => {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const nextOrder = priorities.length;

	if (priorities.length === 0) {
		return (
			<>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Inbox className="size-4" />
						</EmptyMedia>
						<EmptyTitle>No priorities yet</EmptyTitle>
						<EmptyDescription>
							There are no task priorities configured for this project. Create a
							new priority to get started.
						</EmptyDescription>
					</EmptyHeader>
					{canManageProject && (
						<EmptyContent>
							<Button onClick={() => setIsCreateOpen(true)}>
								<Plus className="size-4" />
								New Priority
							</Button>
						</EmptyContent>
					)}
				</Empty>

				{canManageProject && (
					<CreateTaskPriorityDialog
						projectId={projectId}
						nextOrder={nextOrder}
						open={isCreateOpen}
						onOpenChange={setIsCreateOpen}
					/>
				)}
			</>
		);
	}

	return (
		<div className="space-y-4">
			{canManageProject && (
				<Button onClick={() => setIsCreateOpen(true)}>
					<Plus className="size-4" />
					New Priority
				</Button>
			)}
			<DataTable<TTaskPriority>
				data={priorities}
				columns={
					canManageProject
						? taskPriorityColumns
						: taskPriorityColumns.filter((column) => column.id !== "actions")
				}
				getRowId={(row) => row.id}
				showPagination={true}
				enablePagination={true}
				enableRowSelection={false}
				enableColumnReorder={false}
				enableColumnPinning={false}
			/>
			{canManageProject && (
				<CreateTaskPriorityDialog
					projectId={projectId}
					nextOrder={nextOrder}
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
				/>
			)}
		</div>
	);
};
