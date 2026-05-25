import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createProjectFn,
	deleteProjectFn,
	fetchProjectMemberWorkloadFn,
	fetchProjectRecentStatusUpdatesFn,
	fetchProjectTaskStatsFn,
	getMyProjectsFn,
	getProjectByIdFn,
	getProjectsFn,
	updateProjectFn,
} from "./functions";
import type { TGetProjectsInput, TStatsPeriod } from "./schemas";

export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	list: (params: TGetProjectsInput) =>
		[...projectKeys.lists(), params] as const,
	myProjectsAll: () => [...projectKeys.all, "me"] as const,
	myProjects: (teamId?: string) =>
		[...projectKeys.myProjectsAll(), teamId ?? "all"] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (id: string) => [...projectKeys.details(), id] as const,
	taskStats: (projectId: string, period: TStatsPeriod) =>
		[...projectKeys.all, "task-stats", projectId, period] as const,
	workload: (projectId: string, period: TStatsPeriod) =>
		[...projectKeys.all, "workload", projectId, period] as const,
	recentUpdates: (projectId: string) =>
		[...projectKeys.all, "recent-updates", projectId] as const,
};

export const projectsQueryOptions = (params: TGetProjectsInput = {}) =>
	queryOptions({
		queryKey: projectKeys.list(params),
		queryFn: () => getProjectsFn({ data: params }),
	});

export const myProjectsQueryOptions = (teamId?: string) =>
	queryOptions({
		queryKey: projectKeys.myProjects(teamId),
		queryFn: () => getMyProjectsFn({ data: { teamId } }),
	});

export const projectQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: projectKeys.detail(projectId),
		queryFn: () => getProjectByIdFn({ data: { projectId } }),
	});

export const projectTaskStatsQueryOptions = (
	projectId: string,
	period: TStatsPeriod = "weekly",
) =>
	queryOptions({
		queryKey: projectKeys.taskStats(projectId, period),
		queryFn: () => fetchProjectTaskStatsFn({ data: { projectId, period } }),
	});

export const projectWorkloadQueryOptions = (
	projectId: string,
	period: TStatsPeriod = "weekly",
) =>
	queryOptions({
		queryKey: projectKeys.workload(projectId, period),
		queryFn: () =>
			fetchProjectMemberWorkloadFn({ data: { projectId, period } }),
	});

export const projectRecentStatusUpdatesQueryOptions = (
	projectId: string,
	limit: number = 10,
) =>
	queryOptions({
		queryKey: projectKeys.recentUpdates(projectId),
		queryFn: () =>
			fetchProjectRecentStatusUpdatesFn({ data: { projectId, limit } }),
	});

export const useProjectMutations = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: (payload: any) => createProjectFn({ data: payload }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: projectKeys.myProjectsAll(),
				}),
			]);
		},
	});

	const update = useMutation({
		mutationFn: (data: { projectId: string; payload: any }) =>
			updateProjectFn({
				data: { projectId: data.projectId, payload: data.payload },
			}),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: projectKeys.myProjectsAll(),
				}),
				queryClient.invalidateQueries({
					queryKey: projectKeys.detail(variables.projectId),
				}),
			]);
		},
	});

	const remove = useMutation({
		mutationFn: (projectId: string) => deleteProjectFn({ data: projectId }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: projectKeys.myProjectsAll(),
				}),
			]);
		},
	});

	return { create, update, remove };
};
