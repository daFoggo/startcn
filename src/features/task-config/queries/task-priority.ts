import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createTaskPriorityFn,
	deleteTaskPriorityFn,
	getTaskPrioritiesFn,
	getTaskPriorityByIdFn,
	updateTaskPriorityFn,
} from "../functions";
import type { TTaskPriorityFindInput } from "../schemas";
import { taskConfigKeys } from "./keys";

export const taskPrioritiesQueryOptions = (
	projectId: string,
	params?: TTaskPriorityFindInput,
) =>
	queryOptions({
		queryKey: taskConfigKeys.priorities(projectId, params),
		queryFn: () => getTaskPrioritiesFn({ data: { projectId, params } }),
	});

export const taskPriorityQueryOptions = (
	projectId: string,
	priorityId: string,
) =>
	queryOptions({
		queryKey: taskConfigKeys.priorityDetail(projectId, priorityId),
		queryFn: () => getTaskPriorityByIdFn({ data: { projectId, priorityId } }),
	});

export const taskPriorityQueries = {
	priorities: taskPrioritiesQueryOptions,
	priorityDetail: taskPriorityQueryOptions,
};

export const useTaskPriorityMutations = () => {
	const queryClient = useQueryClient();

	const createPriority = useMutation({
		mutationFn: (data: { projectId: string; payload: any }) =>
			createTaskPriorityFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	const updatePriority = useMutation({
		mutationFn: (data: {
			projectId: string;
			priorityId: string;
			payload: any;
		}) => updateTaskPriorityFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	const removePriority = useMutation({
		mutationFn: (data: { projectId: string; priorityId: string }) =>
			deleteTaskPriorityFn({ data }),
		onSuccess: async (_, variables) => {
			await queryClient.invalidateQueries({
				queryKey: taskConfigKeys.all(variables.projectId),
			});
		},
	});

	return {
		createPriority,
		updatePriority,
		removePriority,
	};
};
