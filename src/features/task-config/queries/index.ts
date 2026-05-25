import { taskPriorityQueries, useTaskPriorityMutations } from "./task-priority";
import { taskStatusQueries, useTaskStatusMutations } from "./task-status";
import { taskTagQueries, useTaskTagMutations } from "./task-tag";
import { taskTypeQueries, useTaskTypeMutations } from "./task-type";

export * from "./keys";
export * from "./task-priority";
export * from "./task-status";
export * from "./task-tag";
export * from "./task-type";

export const taskConfigQueries = {
	...taskStatusQueries,
	...taskTypeQueries,
	...taskPriorityQueries,
	...taskTagQueries,
};

export const useTaskConfigMutations = () => {
	const statusMutations = useTaskStatusMutations();
	const typeMutations = useTaskTypeMutations();
	const priorityMutations = useTaskPriorityMutations();
	const tagMutations = useTaskTagMutations();

	return {
		...statusMutations,
		...typeMutations,
		...priorityMutations,
		...tagMutations,
	};
};
