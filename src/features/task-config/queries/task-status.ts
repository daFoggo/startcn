import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createTaskStatusFn,
	deleteTaskStatusFn,
	getTaskStatusByIdFn,
	getTaskStatusesFn,
	updateTaskStatusFn,
} from "../functions";
import type { TTaskStatusFindInput } from "../schemas";
import { taskConfigKeys } from "./keys";

export const taskStatusesQueryOptions = (
	projectId: string,
	params?: TTaskStatusFindInput,
) =>
	queryOptions({
		queryKey: taskConfigKeys.statuses(projectId, params),
		queryFn: () => getTaskStatusesFn({ data: { projectId, params } }),
	});

export const taskStatusQueryOptions = (projectId: string, statusId: string) =>
	queryOptions({
		queryKey: taskConfigKeys.statusDetail(projectId, statusId),
		queryFn: () => getTaskStatusByIdFn({ data: { projectId, statusId } }),
	});

export const taskStatusQueries = {
	statuses: taskStatusesQueryOptions,
	statusDetail: taskStatusQueryOptions,
};

export const useTaskStatusMutations = () => {
	const queryClient = useQueryClient();

	const createStatus = useMutation({
		mutationFn: (data: { projectId: string; payload: any }) =>
			createTaskStatusFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	const updateStatus = useMutation({
		mutationFn: (data: { projectId: string; statusId: string; payload: any }) =>
			updateTaskStatusFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	const removeStatus = useMutation({
		mutationFn: (data: { projectId: string; statusId: string }) =>
			deleteTaskStatusFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	return {
		createStatus,
		updateStatus,
		removeStatus,
	};
};
