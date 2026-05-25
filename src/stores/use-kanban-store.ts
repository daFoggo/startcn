import type {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TTaskStatus } from "@/features/task-config";
import type { TTask } from "@/features/tasks";

interface IKanbanStore {
	// Persisted state
	columnOrders: Record<string, string[]>; // projectId -> statusIds[]
	setColumnOrder: (projectId: string, statusIds: string[]) => void;
	getColumnOrder: (projectId: string) => string[] | undefined;

	// Transient state
	tasks: TTask[];
	setTasks: (tasks: TTask[]) => void;
	activeTask: TTask | null;
	activeColumn: TTaskStatus | null;
	selectedTask: TTask | null;
	taskToDelete: TTask | null;
	isEditOpen: boolean;
	isCreateOpen: boolean;
	isDeleteOpen: boolean;
	defaultStatusId: string | undefined;

	// Setter Actions
	setActiveTask: (task: TTask | null) => void;
	setActiveColumn: (column: TTaskStatus | null) => void;
	setSelectedTask: (task: TTask | null) => void;
	setTaskToDelete: (task: TTask | null) => void;
	setIsEditOpen: (open: boolean) => void;
	setIsCreateOpen: (open: boolean) => void;
	setIsDeleteOpen: (open: boolean) => void;
	setDefaultStatusId: (statusId: string | undefined) => void;

	// Combined UI Actions
	openCreateDialog: (statusId: string) => void;
	openEditDialog: (task: TTask) => void;
	openDeleteDialog: (task: TTask) => void;
	closeDialogs: () => void;

	// Drag and Drop Actions
	handleDragStart: (event: DragStartEvent, statuses: TTaskStatus[]) => void;
	handleDragOver: (event: DragOverEvent) => void;
	handleDragEnd: (
		event: DragEndEvent,
		statuses: TTaskStatus[],
		projectId: string,
		initialTasks: TTask[],
		updateStatusMutate: (args: any) => void,
		updateTaskMutate: (args: any) => void,
	) => void;
}

export const useKanbanStore = create<IKanbanStore>()(
	persist(
		(set, get) => ({
			columnOrders: {},
			setColumnOrder: (projectId, statusIds) =>
				set((state) => ({
					columnOrders: {
						...state.columnOrders,
						[projectId]: statusIds,
					},
				})),
			getColumnOrder: (projectId) => get().columnOrders[projectId],

			// Transient state defaults
			tasks: [],
			setTasks: (tasks) => set({ tasks }),
			activeTask: null,
			activeColumn: null,
			selectedTask: null,
			taskToDelete: null,
			isEditOpen: false,
			isCreateOpen: false,
			isDeleteOpen: false,
			defaultStatusId: undefined,

			// Setter actions
			setActiveTask: (activeTask) => set({ activeTask }),
			setActiveColumn: (activeColumn) => set({ activeColumn }),
			setSelectedTask: (selectedTask) => set({ selectedTask }),
			setTaskToDelete: (taskToDelete) => set({ taskToDelete }),
			setIsEditOpen: (isEditOpen) => set({ isEditOpen }),
			setIsCreateOpen: (isCreateOpen) => set({ isCreateOpen }),
			setIsDeleteOpen: (isDeleteOpen) => set({ isDeleteOpen }),
			setDefaultStatusId: (defaultStatusId) => set({ defaultStatusId }),

			// Combined actions
			openCreateDialog: (statusId) =>
				set({ isCreateOpen: true, defaultStatusId: statusId }),
			openEditDialog: (task) => set({ isEditOpen: true, selectedTask: task }),
			openDeleteDialog: (task) =>
				set({ isDeleteOpen: true, taskToDelete: task }),
			closeDialogs: () =>
				set({
					isCreateOpen: false,
					isEditOpen: false,
					isDeleteOpen: false,
					selectedTask: null,
					taskToDelete: null,
					defaultStatusId: undefined,
				}),

			// Drag and Drop handlers
			handleDragStart: (event, statuses) => {
				const { active } = event;
				const data = active.data.current;
				if (data?.type === "column") {
					set({
						activeColumn: statuses.find((s) => s.id === active.id) || null,
					});
				} else if (data?.type === "card") {
					set({ activeTask: data.task || null });
				}
			},

			handleDragOver: (event) => {
				const { active, over } = event;
				if (!over) return;

				const activeId = active.id as string;
				const overId = over.id as string;

				if (activeId === overId) return;

				// Return early if dragging a column
				if (active.data.current?.type === "column") return;

				const isActiveCard = active.data.current?.type === "card";
				const isOverCard = over.data.current?.type === "card";
				const isOverColumn = over.data.current?.type === "column";

				if (!isActiveCard) return;

				if (isOverColumn) {
					const { tasks } = get();
					const activeIndex = tasks.findIndex((t) => t.id === activeId);
					if (tasks[activeIndex] && tasks[activeIndex].status_id !== overId) {
						const newTasks = [...tasks];
						newTasks[activeIndex] = {
							...newTasks[activeIndex],
							status_id: overId,
						};
						set({ tasks: arrayMove(newTasks, activeIndex, activeIndex) });
					}
				} else if (isOverCard) {
					const overTaskStatusId = over.data.current?.task?.status_id;
					if (!overTaskStatusId) return;

					const { tasks } = get();
					const activeIndex = tasks.findIndex((t) => t.id === activeId);
					const overIndex = tasks.findIndex((t) => t.id === overId);

					if (
						tasks[activeIndex] &&
						tasks[activeIndex].status_id !== overTaskStatusId
					) {
						const newTasks = [...tasks];
						newTasks[activeIndex] = {
							...newTasks[activeIndex],
							status_id: overTaskStatusId,
						};
						set({ tasks: arrayMove(newTasks, activeIndex, overIndex) });
					} else if (tasks[activeIndex]) {
						set({ tasks: arrayMove(tasks, activeIndex, overIndex) });
					}
				}
			},

			handleDragEnd: (
				event,
				statuses,
				projectId,
				initialTasks,
				updateStatusMutate,
				updateTaskMutate,
			) => {
				const { active, over } = event;
				const { activeColumn, activeTask, tasks, setColumnOrder } = get();

				// Cleanup active states
				set({ activeColumn: null, activeTask: null });

				if (!over) return;

				const activeId = active.id as string;
				const overId = over.id as string;

				// Handle column drop
				if (activeColumn) {
					if (activeId !== overId) {
						const activeIndex = statuses.findIndex((s) => s.id === activeId);
						const overIndex = statuses.findIndex((s) => s.id === overId);

						if (activeIndex !== -1 && overIndex !== -1) {
							const newStatuses = arrayMove(statuses, activeIndex, overIndex);
							setColumnOrder(
								projectId,
								newStatuses.map((s) => s.id),
							);
							updateStatusMutate({
								projectId,
								statusId: activeId,
								payload: { order: overIndex },
							});
						}
					}
					return;
				}

				// Handle card drop
				if (activeTask) {
					const currentTask = tasks.find((t) => t.id === activeId);
					if (!currentTask) return;

					const initialTask = initialTasks.find((t) => t.id === activeId);

					// If status changed, notify server
					if (currentTask.status_id !== initialTask?.status_id) {
						updateTaskMutate({
							projectId,
							taskId: activeId,
							payload: { status_id: currentTask.status_id },
						});
					}
				}
			},
		}),
		{
			name: "kanban-storage",
			partialize: (state) => ({ columnOrders: state.columnOrders }), // Only persist columnOrders
		},
	),
);
