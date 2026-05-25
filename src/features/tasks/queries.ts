import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { projectKeys } from "@/features/projects";
import { userKeys } from "@/features/users";
import {
	completeTaskFn,
	createTaskCommentFn,
	createTaskFn,
	deleteTaskFn,
	estimateTaskFn,
	fetchMyTasksFn,
	fetchMyTasksOverviewFn,
	fetchTaskActivitiesFn,
	fetchTaskByIdFn,
	fetchTasksFn,
	startTaskFn,
	updateTaskFn,
} from "./functions";
import type { TFindTasksInput } from "./schemas";

/**
 * Các Query Keys dùng cho việc quản lý Cache của React Query
 */
export const taskKeys = {
	all: ["tasks"] as const,
	lists: () => [...taskKeys.all, "list"] as const,
	list: (projectId?: string, params?: TFindTasksInput) =>
		[...taskKeys.lists(), projectId, params] as const,
	details: () => [...taskKeys.all, "detail"] as const,
	detail: (projectId: string, taskId: string) =>
		[...taskKeys.details(), projectId, taskId] as const,
	myTasks: (teamId?: string) =>
		[...taskKeys.all, "my-tasks", teamId ?? "all"] as const,
	myOverview: (teamId?: string, clientToday?: string) =>
		[
			...taskKeys.all,
			"my-overview",
			teamId ?? "all",
			clientToday ?? "today",
		] as const,
	activities: (taskId: string) =>
		[...taskKeys.details(), taskId, "activities"] as const,
};

/**
 * Các Query Object dùng cho việc Fetch data (React Query)
 */
export const tasksQueryOptions = (
	projectId?: string,
	params?: TFindTasksInput,
) =>
	queryOptions({
		queryKey: taskKeys.list(projectId, params),
		queryFn: () => fetchTasksFn({ data: { projectId, params } }),
	});

export const taskQueryOptions = (projectId: string, taskId: string) =>
	queryOptions({
		queryKey: taskKeys.detail(projectId, taskId),
		queryFn: () => fetchTaskByIdFn({ data: { projectId, taskId } }),
	});

export const myTasksQueryOptions = (teamId?: string) =>
	queryOptions({
		queryKey: taskKeys.myTasks(teamId),
		queryFn: () =>
			fetchMyTasksFn({
				data: {
					params: {
						page_size: "all",
						team_id__eq: teamId,
					},
				},
			}),
	});

export const myTasksOverviewQueryOptions = (
	teamId?: string,
	clientToday?: string,
) =>
	queryOptions({
		queryKey: taskKeys.myOverview(teamId, clientToday),
		queryFn: () =>
			fetchMyTasksOverviewFn({
				data: {
					teamId,
					clientToday,
				},
			}),
	});

export const taskActivitiesQueryOptions = (taskId: string) =>
	queryOptions({
		queryKey: taskKeys.activities(taskId),
		queryFn: () => fetchTaskActivitiesFn({ data: { taskId } }),
	});

/**
 * Invalidate tất cả query liên quan đến dashboard charts của project.
 * Dùng prefix projectKeys.all để invalidate các queries con
 */
const invalidateDashboardCharts = (
	queryClient: ReturnType<typeof useQueryClient>,
) =>
	Promise.all([
		queryClient.invalidateQueries({
			queryKey: [...projectKeys.all, "task-stats"],
		}),
		queryClient.invalidateQueries({
			queryKey: [...projectKeys.all, "workload"],
		}),
		queryClient.invalidateQueries({
			queryKey: [...projectKeys.all, "recent-updates"],
		}),
	]);

/**
 * Hook quản lý các Mutation liên quan đến Task (Create, Update, Delete)
 */
export const useTaskMutations = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: (data: { projectId: string; payload: any }) =>
			createTaskFn({ data }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: taskKeys.details() }),
				queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() }),
				queryClient.invalidateQueries({ queryKey: userKeys.statsAll() }),
				invalidateDashboardCharts(queryClient),
			]);
		},
	});

	const update = useMutation({
		mutationFn: (data: { projectId: string; taskId: string; payload: any }) =>
			updateTaskFn({ data }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: taskKeys.detail(variables.projectId, variables.taskId),
				}),
				queryClient.invalidateQueries({
					queryKey: taskKeys.activities(variables.taskId),
				}),
				queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() }),
				queryClient.invalidateQueries({ queryKey: userKeys.statsAll() }),
				invalidateDashboardCharts(queryClient),
			]);
		},
	});

	const remove = useMutation({
		mutationFn: (data: { projectId: string; taskId: string }) =>
			deleteTaskFn({ data }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: taskKeys.detail(variables.projectId, variables.taskId),
				}),
				queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() }),
				queryClient.invalidateQueries({ queryKey: userKeys.statsAll() }),
				invalidateDashboardCharts(queryClient),
			]);
		},
	});

	const estimate = useMutation({
		mutationFn: (data: {
			projectId: string;
			payload: { title: string; description: string | null };
		}) => estimateTaskFn({ data }),
	});

	const start = useMutation({
		mutationFn: (data: { taskId: string; projectId: string }) =>
			startTaskFn({ data: { taskId: data.taskId } }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: taskKeys.detail(variables.projectId, variables.taskId),
				}),
				queryClient.invalidateQueries({
					queryKey: taskKeys.activities(variables.taskId),
				}),
				invalidateDashboardCharts(queryClient),
			]);
		},
	});

	const complete = useMutation({
		mutationFn: (data: {
			taskId: string;
			projectId: string;
			completedAt?: string;
		}) =>
			completeTaskFn({
				data: { taskId: data.taskId, completedAt: data.completedAt },
			}),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: taskKeys.detail(variables.projectId, variables.taskId),
				}),
				queryClient.invalidateQueries({
					queryKey: taskKeys.activities(variables.taskId),
				}),
				queryClient.invalidateQueries({ queryKey: userKeys.statsAll() }),
				invalidateDashboardCharts(queryClient),
			]);
		},
	});

	const addComment = useMutation({
		mutationFn: (data: { taskId: string; content: string }) =>
			createTaskCommentFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskKeys.activities(variables.taskId),
			});
		},
	});

	return { create, update, remove, estimate, start, complete, addComment };
};
