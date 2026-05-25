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
import type { TTaskType } from "../../schemas";
import { CreateTaskTypeDialog } from "./create-task-type-dialog";
import { taskTypeColumns } from "./task-type-columns";

interface ITaskTypeListProps {
	projectId: string;
	types: TTaskType[];
	canManageProject?: boolean;
}

export const TaskTypeList = ({
	projectId,
	types,
	canManageProject = true,
}: ITaskTypeListProps) => {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const nextOrder = types.length;

	if (types.length === 0) {
		return (
			<>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Inbox className="size-4" />
						</EmptyMedia>
						<EmptyTitle>No types yet</EmptyTitle>
						<EmptyDescription>
							There are no task types configured for this project. Create a new
							type to get started.
						</EmptyDescription>
					</EmptyHeader>
					{canManageProject && (
						<EmptyContent>
							<Button onClick={() => setIsCreateOpen(true)}>
								<Plus className="size-4" />
								New Type
							</Button>
						</EmptyContent>
					)}
				</Empty>

				{canManageProject && (
					<CreateTaskTypeDialog
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
					New Type
				</Button>
			)}
			<DataTable<TTaskType>
				data={types}
				columns={
					canManageProject
						? taskTypeColumns
						: taskTypeColumns.filter((column) => column.id !== "actions")
				}
				getRowId={(row) => row.id}
				showPagination={true}
				enablePagination={true}
				enableRowSelection={false}
				enableColumnReorder={false}
				enableColumnPinning={false}
			/>
			{canManageProject && (
				<CreateTaskTypeDialog
					projectId={projectId}
					nextOrder={nextOrder}
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
				/>
			)}
		</div>
	);
};
