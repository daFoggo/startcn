import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createTaskTypeFn,
	deleteTaskTypeFn,
	getTaskTypeByIdFn,
	getTaskTypesFn,
	updateTaskTypeFn,
} from "../functions";
import type { TTaskTypeFindInput } from "../schemas";
import { taskConfigKeys } from "./keys";

export const taskTypesQueryOptions = (
	projectId: string,
	params?: TTaskTypeFindInput,
) =>
	queryOptions({
		queryKey: taskConfigKeys.types(projectId, params),
		queryFn: () => getTaskTypesFn({ data: { projectId, params } }),
	});

export const taskTypeQueryOptions = (projectId: string, typeId: string) =>
	queryOptions({
		queryKey: taskConfigKeys.typeDetail(projectId, typeId),
		queryFn: () => getTaskTypeByIdFn({ data: { projectId, typeId } }),
	});

export const taskTypeQueries = {
	types: taskTypesQueryOptions,
	typeDetail: taskTypeQueryOptions,
};

export const useTaskTypeMutations = () => {
	const queryClient = useQueryClient();

	const createType = useMutation({
		mutationFn: (data: { projectId: string; payload: any }) =>
			createTaskTypeFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	const updateType = useMutation({
		mutationFn: (data: { projectId: string; typeId: string; payload: any }) =>
			updateTaskTypeFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	const removeType = useMutation({
		mutationFn: (data: { projectId: string; typeId: string }) =>
			deleteTaskTypeFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	return {
		createType,
		updateType,
		removeType,
	};
};
