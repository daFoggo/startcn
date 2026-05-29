import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getProjectByIdFn,
	listProjectsFn,
	submitAnnotationAnswerFn,
} from "./functions";
import type { TSubmitAnnotationAnswerInput } from "./schemas";

export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	list: () => [...projectKeys.lists()] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (projectId: string) => [...projectKeys.details(), projectId] as const,
};

export const projectsListQueryOptions = () =>
	queryOptions({
		queryKey: projectKeys.list(),
		queryFn: () => listProjectsFn(),
	});

export const projectByIdQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: projectKeys.detail(projectId),
		queryFn: () => getProjectByIdFn({ data: { projectId } }),
	});

export const useProjectMutations = () => {
	const queryClient = useQueryClient();

	const submitAnnotationAnswer = useMutation({
		mutationFn: (variables: TSubmitAnnotationAnswerInput) =>
			submitAnnotationAnswerFn({ data: variables }),
		onSuccess: (_result, variables) => {
			void queryClient.invalidateQueries({
				queryKey: projectKeys.detail(variables.projectId),
			});
			void queryClient.invalidateQueries({ queryKey: projectKeys.list() });
		},
	});

	return { submitAnnotationAnswer };
};
