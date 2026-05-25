import { useForm } from "@tanstack/react-form";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import {
	buildTaskDetailPayload,
	cloneTaskDetailFormValues,
	getTaskDetailDefaultValues,
	serializeTaskDetailFormValues,
} from "../../helpers";
import { useTaskMutations } from "../../queries";
import {
	CreateTaskSchema,
	type ITaskListDialogOptions,
	type TTask,
	type TTaskAIEstimationExplanation,
	type TTaskDetailFormValues,
	UpdateTaskSchema,
} from "../../schemas";
import { DeleteTaskListDialog } from "../task-table/delete-task-list-dialog";
import type { ITaskActivityLog } from "./task-activity";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskDetailMainSection } from "./task-detail-main-section";
import { TaskDetailSidebarSection } from "./task-detail-sidebar-section";

interface ITaskDetailViewProps {
	task?: TTask;
	options: ITaskListDialogOptions;
	parentTaskOptions?: TTask[];
	isLoading?: boolean;
	defaultStatusId?: string;
	defaultParentId?: string | null;
	activities?: ITaskActivityLog[];
	isActivitiesLoading?: boolean;
	isActivitiesError?: boolean;
	activitiesError?: unknown;
	canManageTasks?: boolean;
}

export const TaskDetailView = ({
	task,
	options,
	parentTaskOptions = [],
	isLoading,
	defaultStatusId,
	defaultParentId,
	activities = [],
	isActivitiesLoading = false,
	isActivitiesError = false,
	activitiesError,
	canManageTasks = true,
}: ITaskDetailViewProps) => {
	const navigate = useNavigate();
	const { teamId, projectId } = useParams({ strict: false });
	const search = useSearch({ strict: false });
	const redirectTo = (search as any).redirect_to;
	const parentTaskId = (search as any).parent_task_id;
	const { update, remove, estimate, create } = useTaskMutations();

	const navigateBack = (overrideProjectId?: string) => {
		const pId = overrideProjectId || projectId || task?.project_id || "";
		const tId = teamId || "personal";
		const common = {
			params: {
				teamId: tId,
				projectId: pId,
			},
		};

		switch (redirectTo) {
			case "board":
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/board",
					...common,
				});
				break;
			case "timeline":
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/timeline",
					...common,
				});
				break;
			case "dashboard":
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/dashboard",
					...common,
				});
				break;
			case "members":
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/members",
					...common,
				});
				break;
			case "task":
				if (parentTaskId) {
					navigate({
						to: "/dashboard/$teamId/projects/$projectId/tasks/$taskId",
						params: {
							...common.params,
							taskId: parentTaskId,
						},
						search: { redirect_to: "list" } as any,
					});
					break;
				}
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/list",
					...common,
				});
				break;
			default:
				navigate({
					to: "/dashboard/$teamId/projects/$projectId/list",
					...common,
				});
		}
	};
	const [aiExplanation, setAiExplanation] =
		useState<TTaskAIEstimationExplanation | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const defaultValues = getTaskDetailDefaultValues(
		task,
		options,
		defaultStatusId,
		defaultParentId,
	);
	const lastSavedSignatureRef = useRef(
		serializeTaskDetailFormValues(defaultValues),
	);
	const autosaveQueueRef = useRef<TTaskDetailFormValues | null>(null);
	const autosaveRunningRef = useRef(false);
	type TAutosaveFormApi = { reset: (value: TTaskDetailFormValues) => void };

	const queueAutosave = async (
		formApi: TAutosaveFormApi,
		value: TTaskDetailFormValues,
	) => {
		if (!task?.id || !canManageTasks) return;

		autosaveQueueRef.current = cloneTaskDetailFormValues(value);
		if (autosaveRunningRef.current) return;

		autosaveRunningRef.current = true;

		try {
			while (autosaveQueueRef.current) {
				const nextValue = autosaveQueueRef.current;
				autosaveQueueRef.current = null;

				const signature = serializeTaskDetailFormValues(nextValue);
				if (signature === lastSavedSignatureRef.current) {
					continue;
				}

				const taskPayload = buildTaskDetailPayload(nextValue);
				if (!taskPayload) {
					toast.error("Invalid dates provided");
					return;
				}

				const targetProjectId = projectId || task.project_id;
				if (!targetProjectId) {
					toast.error("Project boundary context missing");
					return;
				}

				await update.mutateAsync({
					projectId: targetProjectId,
					taskId: task.id,
					payload: taskPayload.payload,
				});

				lastSavedSignatureRef.current = signature;

				if (!autosaveQueueRef.current) {
					formApi.reset(cloneTaskDetailFormValues(nextValue));
				}
			}
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to update task"));
		} finally {
			autosaveRunningRef.current = false;
		}
	};

	const form = useForm({
		defaultValues,
		validators: {
			// Dynamically choose schema if we wanted full validation, but usually Update is looser/safer
			onSubmit: (task ? UpdateTaskSchema : CreateTaskSchema) as any,
		},
		listeners: {
			onChangeDebounceMs: 1000,
			onChange: ({ formApi }) => {
				if (canManageTasks && task?.id && formApi.state.isDirty) {
					void queueAutosave(
						formApi,
						formApi.state.values as TTaskDetailFormValues,
					);
				}
			},
			onBlur: ({ formApi }) => {
				if (canManageTasks && task?.id && formApi.state.isDirty) {
					void queueAutosave(
						formApi,
						formApi.state.values as TTaskDetailFormValues,
					);
				}
			},
		},
		onSubmit: async ({ value }) => {
			const taskPayload = buildTaskDetailPayload(
				value as TTaskDetailFormValues,
			);
			if (!canManageTasks) return;
			if (!taskPayload) {
				toast.error("Invalid dates provided");
				return;
			}

			const targetProjectId = projectId || task?.project_id;
			if (!targetProjectId) {
				toast.error("Project boundary context missing");
				return;
			}

			try {
				if (task?.id) {
					// Mode: UPDATE
					await update.mutateAsync({
						projectId: targetProjectId,
						taskId: task.id,
						payload: taskPayload.payload,
					});
					toast.success("Task updated successfully");
				} else {
					// Mode: CREATE
					const createPayload = {
						...taskPayload.payload,
						project_id: targetProjectId,
						order: 0,
					};
					await create.mutateAsync({
						projectId: targetProjectId,
						payload: createPayload,
					});
					toast.success("Task created successfully!");
				}

				if (task?.id) {
					lastSavedSignatureRef.current = serializeTaskDetailFormValues(
						value as TTaskDetailFormValues,
					);
					form.reset(cloneTaskDetailFormValues(value as TTaskDetailFormValues));
				}

				// Only eject back to project context if performing absolute creation routines.
				if (!task?.id) {
					navigateBack(targetProjectId);
				}
			} catch (error) {
				toast.error(
					getErrorMessage(
						error,
						task ? "Failed to update task" : "Failed to create task",
					),
				);
			}
		},
	});

	const handleAIEstimate = async () => {
		const title = form.getFieldValue("title");
		if (!title) {
			toast.error("Please enter a task title first!");
			return;
		}
		const targetProjectId = projectId || task?.project_id;
		if (!targetProjectId) {
			toast.error("No active project context found for AI prediction");
			return;
		}

		try {
			const result = await estimate.mutateAsync({
				projectId: targetProjectId,
				payload: {
					title,
					description: form.getFieldValue("description") || null,
				},
			});
			if (result?.suggested_hours !== undefined) {
				form.setFieldValue("estimated_hours", result.suggested_hours);
				setAiExplanation(result);
			}
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to generate AI estimation"));
		}
	};

	const handleConfirmDelete = async () => {
		if (!task?.id) return false;
		try {
			await remove.mutateAsync({
				projectId: projectId || task.project_id,
				taskId: task.id,
			});
			toast.success("Task deleted successfully");
			navigateBack(projectId || task.project_id);
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete task"));
			return false;
		}
	};

	if (isLoading) {
		return (
			<div className="container grid max-w-7xl grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_380px]">
				<div className="space-y-4">
					<Skeleton className="h-10 w-1/3" />
					<Skeleton className="h-50 w-full" />
				</div>
				<div className="space-y-4">
					<Skeleton className="h-100 w-full" />
				</div>
			</div>
		);
	}

	return (
		<>
			<form
				data-slot="task-detail-view"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (canManageTasks) {
						form.handleSubmit();
					}
				}}
				className="container h-full"
			>
				<Card size="sm">
					<TaskDetailHeader
						task={task}
						form={form}
						canSubmit={form.state.canSubmit}
						isPending={
							update.isPending || create.isPending || form.state.isSubmitting
						}
						canManageTasks={canManageTasks}
						onBack={() => navigateBack()}
						onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
					/>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
							<TaskDetailMainSection
								form={form}
								task={task}
								taskId={task?.id}
								options={options}
								parentTaskOptions={parentTaskOptions}
								isLoading={isLoading}
								activities={activities}
								isActivitiesLoading={isActivitiesLoading}
								isActivitiesError={isActivitiesError}
								activitiesError={activitiesError}
								canManageTasks={canManageTasks}
							/>
							<TaskDetailSidebarSection
								form={form}
								task={task}
								options={options}
								parentTaskOptions={parentTaskOptions}
								aiExplanation={aiExplanation}
								isEstimating={estimate.isPending}
								onAIEstimate={handleAIEstimate}
								canManageTasks={canManageTasks}
							/>
						</div>
					</CardContent>
				</Card>
			</form>
			{task && canManageTasks && (
				<DeleteTaskListDialog
					task={task}
					open={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
					isPending={remove.isPending}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</>
	);
};
