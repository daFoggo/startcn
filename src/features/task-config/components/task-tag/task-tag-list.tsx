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
import type { TTaskTag } from "../../schemas";
import { CreateTaskTagDialog } from "./create-task-tag-dialog";
import { taskTagColumns } from "./task-tag-columns";

interface ITaskTagListProps {
	projectId: string;
	tags: TTaskTag[];
	canManageProject?: boolean;
}

export const TaskTagList = ({
	projectId,
	tags,
	canManageProject = true,
}: ITaskTagListProps) => {
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	if (tags.length === 0) {
		return (
			<>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Inbox className="size-4" />
						</EmptyMedia>
						<EmptyTitle>No tags yet</EmptyTitle>
						<EmptyDescription>
							There are no task tags configured for this project. Create a new
							tag to get started.
						</EmptyDescription>
					</EmptyHeader>
					{canManageProject && (
						<EmptyContent>
							<Button onClick={() => setIsCreateOpen(true)}>
								<Plus className="size-4" />
								New Tag
							</Button>
						</EmptyContent>
					)}
				</Empty>

				{canManageProject && (
					<CreateTaskTagDialog
						projectId={projectId}
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
					New Tag
				</Button>
			)}
			<DataTable<TTaskTag>
				data={tags}
				columns={
					canManageProject
						? taskTagColumns
						: taskTagColumns.filter((column) => column.id !== "actions")
				}
				getRowId={(row) => row.id}
				showPagination={true}
				enablePagination={true}
				enableRowSelection={false}
				enableColumnReorder={false}
				enableColumnPinning={false}
			/>
			{canManageProject && (
				<CreateTaskTagDialog
					projectId={projectId}
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
				/>
			)}
		</div>
	);
};
