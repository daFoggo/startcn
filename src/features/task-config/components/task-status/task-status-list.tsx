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
import type { TTaskStatus } from "../../schemas";
import { CreateTaskStatusDialog } from "./create-task-status-dialog";
import { taskStatusColumns } from "./task-status-columns";

interface ITaskStatusListProps {
	projectId: string;
	statuses: TTaskStatus[];
	canManageProject?: boolean;
}

/**
 * Thành phần hiển thị danh sách tất cả các trạng thái (status) của task trong project.
 */
export const TaskStatusList = ({
	projectId,
	statuses,
	canManageProject = true,
}: ITaskStatusListProps) => {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const nextOrder = statuses.length;

	if (statuses.length === 0) {
		return (
			<>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Inbox className="size-4" />
						</EmptyMedia>
						<EmptyTitle>No statuses yet</EmptyTitle>
						<EmptyDescription>
							There are no task statuses configured for this project. Create a
							new status to get started.
						</EmptyDescription>
					</EmptyHeader>
					{canManageProject && (
						<EmptyContent>
							<Button onClick={() => setIsCreateOpen(true)}>
								<Plus className="size-4" />
								New Status
							</Button>
						</EmptyContent>
					)}
				</Empty>

				{canManageProject && (
					<CreateTaskStatusDialog
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
					New Status
				</Button>
			)}

			<DataTable<TTaskStatus>
				data={statuses}
				columns={
					canManageProject
						? taskStatusColumns
						: taskStatusColumns.filter((column) => column.id !== "actions")
				}
				getRowId={(row) => row.id}
				showPagination={true}
				enablePagination={true}
				enableRowSelection={false}
				enableColumnReorder={false}
				enableColumnPinning={false}
			/>

			{canManageProject && (
				<CreateTaskStatusDialog
					projectId={projectId}
					nextOrder={nextOrder}
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
				/>
			)}
		</div>
	);
};
