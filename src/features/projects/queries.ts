import { queryOptions } from "@tanstack/react-query";
import { getProjectByIdFn, listProjectsFn } from "./functions";

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
