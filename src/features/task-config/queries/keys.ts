import type {
	TTaskPriorityFindInput,
	TTaskStatusFindInput,
	TTaskTagFindInput,
	TTaskTypeFindInput,
} from "../schemas";

export const taskConfigKeys = {
	all: (projectId: string) => ["task-config", projectId] as const,
	statuses: (projectId: string, params?: TTaskStatusFindInput) =>
		[...taskConfigKeys.all(projectId), "statuses", params] as const,
	statusDetail: (projectId: string, statusId: string) =>
		[...taskConfigKeys.all(projectId), "statuses", statusId] as const,
	types: (projectId: string, params?: TTaskTypeFindInput) =>
		[...taskConfigKeys.all(projectId), "types", params] as const,
	typeDetail: (projectId: string, typeId: string) =>
		[...taskConfigKeys.all(projectId), "types", typeId] as const,
	priorities: (projectId: string, params?: TTaskPriorityFindInput) =>
		[...taskConfigKeys.all(projectId), "priorities", params] as const,
	priorityDetail: (projectId: string, priorityId: string) =>
		[...taskConfigKeys.all(projectId), "priorities", priorityId] as const,
	tags: (projectId: string, params?: TTaskTagFindInput) =>
		[...taskConfigKeys.all(projectId), "tags", params] as const,
	tagDetail: (projectId: string, tagId: string) =>
		[...taskConfigKeys.all(projectId), "tags", tagId] as const,
};
