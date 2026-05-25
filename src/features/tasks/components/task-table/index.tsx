import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/data-table";
import {
	ActionBarClose,
	ActionBarGroup,
	ActionBarItem,
	ActionBarSelection,
	ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { TProjectMember } from "@/features/project-members";
import type {
	TTaskPriority as TTaskPriorityOption,
	TTaskStatus as TTaskStatusOption,
	TTaskType as TTaskTypeOption,
} from "@/features/task-config";
import { getErrorMessage } from "@/lib/error";
import { useTaskMutations } from "../../queries";
import type { TTask } from "../../schemas";
import { getTaskColumns } from "./columns";

interface ITaskTableProps {
	projectId: string;
	data: TTask[];
	members: TProjectMember[];
	statuses: TTaskStatusOption[];
	types: TTaskTypeOption[];
	priorities: TTaskPriorityOption[];
	groupBy?: string;
	defaultPageSize?: number;
	canManageTasks?: boolean;
}

const buildTaskTree = (tasks: TTask[]) => {
	const taskById = new Map<string, TTask>();
	const parentByChildId = new Map<string, string>();
	const orderById = new Map<string, number>();

	const ensureTask = (task: TTask, order: number) => {
		if (!orderById.has(task.id)) {
			orderById.set(task.id, order);
		}

		const existingTask = taskById.get(task.id);
		if (existingTask) {
			return existingTask;
		}

		const clonedTask = {
			...task,
			sub_tasks: [],
		};
		taskById.set(task.id, clonedTask);

		return clonedTask;
	};

	const visitTask = (task: TTask, order: number) => {
		ensureTask(task, order);

		if (task.parent_id) {
			parentByChildId.set(task.id, task.parent_id);
		}

		for (const subTask of task.sub_tasks ?? []) {
			const subTaskOrder = orderById.size;
			ensureTask(subTask, subTaskOrder);
			parentByChildId.set(subTask.id, task.id);
			visitTask(subTask, subTaskOrder);
		}
	};

	tasks.forEach((task, index) => {
		visitTask(task, index);
	});

	const roots: TTask[] = [];

	for (const task of taskById.values()) {
		const parentId = parentByChildId.get(task.id) ?? task.parent_id;
		const parentTask =
			parentId && parentId !== task.id ? taskById.get(parentId) : undefined;

		if (parentTask) {
			parentTask.sub_tasks = [...(parentTask.sub_tasks ?? []), task];
		} else {
			roots.push(task);
		}
	}

	const sortTasks = (
		items: TTask[],
		visitedTaskIds = new Set<string>(),
	): TTask[] =>
		[...items]
			.sort(
				(a, b) =>
					(orderById.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
					(orderById.get(b.id) ?? Number.MAX_SAFE_INTEGER),
			)
			.filter((task) => !visitedTaskIds.has(task.id))
			.map((task) => ({
				...task,
				sub_tasks: task.sub_tasks?.length
					? sortTasks(task.sub_tasks, new Set([...visitedTaskIds, task.id]))
					: [],
			}));

	const sortedRoots = sortTasks(roots);
	const visibleTaskIds = new Set<string>();
	const collectVisibleTaskIds = (items: TTask[]) => {
		for (const task of items) {
			visibleTaskIds.add(task.id);
			collectVisibleTaskIds(task.sub_tasks ?? []);
		}
	};
	collectVisibleTaskIds(sortedRoots);

	const orphanedTasks = [...taskById.values()]
		.filter((task) => !visibleTaskIds.has(task.id))
		.map((task) => ({
			...task,
			sub_tasks: [],
		}));

	return [...sortedRoots, ...sortTasks(orphanedTasks)];
};

/**
 * Bảng hiển thị danh sách công việc (Task).
 * Hỗ trợ các tính năng cao cấp như nhóm dữ liệu (Grouping), ghim cột (Pinning) và phân trang.
 */
export const TaskTable = ({
	projectId,
	data,
	members,
	statuses,
	types,
	priorities,
	groupBy,
	defaultPageSize = 20,
	canManageTasks = true,
}: ITaskTableProps) => {
	const navigate = useNavigate();
	const { teamId } = useParams({ strict: false });
	const { remove } = useTaskMutations();
	const [tasksToBulkDelete, setTasksToBulkDelete] = useState<TTask[]>([]);
	const clearBulkSelectionRef = useRef<(() => void) | null>(null);

	const tableOptions = useMemo(
		() => ({
			members,
			statuses,
			types,
			priorities,
		}),
		[members, statuses, types, priorities],
	);

	const columns = useMemo(
		() => getTaskColumns(tableOptions, canManageTasks),
		[tableOptions, canManageTasks],
	);
	const taskTree = useMemo(() => buildTaskTree(data), [data]);
	const bulkDeleteCount = tasksToBulkDelete.length;

	const handleBulkDelete = async () => {
		if (bulkDeleteCount === 0) return;

		try {
			await Promise.all(
				tasksToBulkDelete.map((task) =>
					remove.mutateAsync({
						projectId: task.project_id,
						taskId: task.id,
					}),
				),
			);

			toast.success(
				`${bulkDeleteCount.toLocaleString()} ${
					bulkDeleteCount === 1 ? "task" : "tasks"
				} deleted successfully`,
			);
			setTasksToBulkDelete([]);
			clearBulkSelectionRef.current?.();
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete selected tasks"));
		}
	};

	return (
		<div className="space-y-4">
			{canManageTasks && (
				<Button
					onClick={() =>
						navigate({
							to: "/dashboard/$teamId/projects/$projectId/tasks/create",
							params: { teamId: teamId || "personal", projectId },
							search: { redirect_to: "list" } as any,
						})
					}
				>
					<Plus className="size-4" />
					New Task
				</Button>
			)}

			<DataTable<TTask>
				data={taskTree}
				columns={columns}
				getRowId={(row) => row.id}
				getSubRows={(row) =>
					row.sub_tasks && row.sub_tasks.length > 0 ? row.sub_tasks : undefined
				}
				onRowClick={(row) =>
					navigate({
						to: "/dashboard/$teamId/projects/$projectId/tasks/$taskId",
						params: { teamId: teamId || "all", projectId, taskId: row.id },
						search: { redirect_to: "list" } as any,
					})
				}
				defaultGrouping={groupBy ? [groupBy] : []}
				defaultColumnPinning={{
					left: [canManageTasks ? "select" : "", "title"].filter(Boolean),
					right: canManageTasks ? ["actions"] : [],
				}}
				enableRowSelection={canManageTasks}
				defaultPageSize={defaultPageSize}
				enablePagination={false}
				renderSelectionActionBar={({
					selectedRows,
					selectedCount,
					clearSelection,
				}) => (
					<>
						<ActionBarSelection>
							{selectedCount.toLocaleString()} selected
						</ActionBarSelection>
						<ActionBarSeparator />
						<ActionBarGroup>
							<ActionBarItem
								variant="destructive"
								closeOnSelect={false}
								onSelect={() => {
									clearBulkSelectionRef.current = clearSelection;
									setTasksToBulkDelete(selectedRows.map((row) => row.original));
								}}
							>
								<Trash2 className="size-4" />
								Delete selected
							</ActionBarItem>
						</ActionBarGroup>
						<ActionBarClose aria-label="Clear selection">
							<X className="size-3.5" />
						</ActionBarClose>
					</>
				)}
			/>

			<AlertDialog
				open={bulkDeleteCount > 0}
				onOpenChange={(open) => {
					if (!open && !remove.isPending) {
						setTasksToBulkDelete([]);
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete selected tasks</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete {bulkDeleteCount.toLocaleString()}{" "}
							{bulkDeleteCount === 1 ? "task" : "tasks"}? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={remove.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							disabled={remove.isPending}
							onClick={(event) => {
								event.preventDefault();
								void handleBulkDelete();
							}}
						>
							{remove.isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2 className="size-4" />
									Delete
								</>
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
