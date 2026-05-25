import {
	DndContext,
	DragOverlay,
	defaultDropAnimationSideEffects,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	pointerWithin,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	horizontalListSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

import type { TProjectMember } from "@/features/project-members";
import {
	type TTaskPriority,
	type TTaskStatus,
	type TTaskType,
	useTaskConfigMutations,
} from "@/features/task-config";
import { getErrorMessage } from "@/lib/error";
import { useKanbanStore } from "@/stores/use-kanban-store";
import { useTaskMutations } from "../../queries";
import type { TTask } from "../../schemas";
import { DeleteTaskListDialog } from "../task-table/delete-task-list-dialog";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";

interface ITaskKanbanProps {
	projectId: string;
	tasks: TTask[];
	statuses: TTaskStatus[];
	types: TTaskType[];
	priorities: TTaskPriority[];
	members: TProjectMember[];
	canManageTasks?: boolean;
}

export const TaskKanban = ({
	projectId,
	tasks: initialTasks,
	statuses,
	types: _types,
	priorities: _priorities,
	members: _members,
	canManageTasks = true,
}: ITaskKanbanProps): React.ReactNode => {
	const {
		tasks,
		setTasks,
		activeTask,
		activeColumn,
		taskToDelete,
		isDeleteOpen,
		setIsDeleteOpen,
		openDeleteDialog,
		closeDialogs,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useKanbanStore();

	const { teamId } = useParams({ strict: false });
	const navigate = useNavigate();
	const { update, remove } = useTaskMutations();
	const { updateStatus } = useTaskConfigMutations();

	const handleTaskClick = (task: TTask) => {
		navigate({
			to: "/dashboard/$teamId/projects/$projectId/tasks/$taskId",
			params: {
				teamId: teamId || "all",
				projectId,
				taskId: task.id,
			},
			search: { redirect_to: "board" } as any,
		});
	};

	useEffect(() => {
		setTasks(initialTasks);
	}, [initialTasks, setTasks]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Custom collision detection to ignore Y-axis for columns, making horizontal dragging flawless
	const customCollisionDetection = (args: any) => {
		// 1. If we are dragging a column, only check X-axis intersection
		if (args.active.data.current?.type === "column") {
			const activeRect = args.active.rect.current?.translated;
			if (!activeRect) return pointerWithin(args);

			const columnContainers = args.droppableContainers.filter(
				(c: any) =>
					c.data.current?.type === "column" && c.id !== args.active.id,
			);

			let closestId = null;
			let maxIntersectionRatio = 0;

			for (const container of columnContainers) {
				const targetRect = container.rect.current;
				if (!targetRect) continue;

				// Calculate horizontal overlap
				const overlapLeft = Math.max(activeRect.left, targetRect.left);
				const overlapRight = Math.min(activeRect.right, targetRect.right);
				const overlapX = overlapRight - overlapLeft;

				if (overlapX > 0) {
					const intersectionRatio = overlapX / activeRect.width;
					if (intersectionRatio > maxIntersectionRatio) {
						maxIntersectionRatio = intersectionRatio;
						closestId = container.id;
					}
				}
			}

			// If we overlap more than 20% horizontally, trigger the swap
			if (closestId && maxIntersectionRatio > 0.2) {
				return [
					{
						id: closestId,
						data: {
							droppableContainer: args.droppableContainers.find(
								(c: any) => c.id === closestId,
							),
						},
					},
				];
			}
			return [];
		}

		// 2. For cards, use standard pointerWithin
		return pointerWithin(args);
	};

	const handleConfirmDelete = async () => {
		if (!taskToDelete) return false;
		try {
			await remove.mutateAsync({
				projectId: taskToDelete.project_id,
				taskId: taskToDelete.id,
			});
			toast.success("Task deleted successfully");
			closeDialogs();
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete task"));
			return false;
		}
	};

	const dropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: {
				active: {
					opacity: "0.4",
				},
			},
		}),
	};

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={customCollisionDetection}
				measuring={{
					droppable: {
						strategy: MeasuringStrategy.Always,
					},
				}}
				onDragStart={
					canManageTasks ? (e) => handleDragStart(e, statuses) : undefined
				}
				onDragOver={canManageTasks ? handleDragOver : undefined}
				onDragEnd={
					canManageTasks
						? (e) =>
								handleDragEnd(
									e,
									statuses,
									projectId,
									initialTasks,
									updateStatus.mutate,
									update.mutate,
								)
						: undefined
				}
			>
				<div className="flex h-full w-full gap-4 overflow-x-auto overflow-y-hidden">
					<SortableContext
						items={statuses.map((s) => s.id)}
						strategy={horizontalListSortingStrategy}
					>
						{statuses.map((status) => (
							<KanbanColumn
								key={status.id}
								id={status.id}
								title={status.name}
								tasks={tasks.filter((t) => t.status_id === status.id)}
								onTaskClick={handleTaskClick}
								onDeleteTask={canManageTasks ? openDeleteDialog : undefined}
								onAddTask={(statusId) => {
									navigate({
										to: "/dashboard/$teamId/projects/$projectId/tasks/create",
										params: { teamId: teamId || "personal", projectId },
										search: {
											status_id: statusId,
											redirect_to: "board",
										} as any,
									});
								}}
								canManageTasks={canManageTasks}
							/>
						))}
					</SortableContext>
				</div>

				<DragOverlay dropAnimation={dropAnimation}>
					{activeColumn && (
						<div className="pointer-events-none scale-105 -rotate-2 cursor-grabbing transition-transform">
							<KanbanColumn
								id={activeColumn.id}
								title={activeColumn.name}
								tasks={tasks.filter((t) => t.status_id === activeColumn.id)}
								onTaskClick={() => {}}
								onAddTask={() => {}}
								isOverlay
								canManageTasks={canManageTasks}
							/>
						</div>
					)}
					{activeTask && (
						<div className="pointer-events-none scale-105 -rotate-2 cursor-grabbing transition-transform">
							<KanbanCard
								task={activeTask}
								onClick={() => {}}
								isOverlay
								canDrag={canManageTasks}
							/>
						</div>
					)}
				</DragOverlay>
			</DndContext>

			{taskToDelete && (
				<DeleteTaskListDialog
					task={taskToDelete}
					open={isDeleteOpen}
					onOpenChange={setIsDeleteOpen}
					isPending={remove.isPending}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</>
	);
};
