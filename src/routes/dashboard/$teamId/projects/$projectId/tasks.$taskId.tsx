import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";

import { projectMembersQueryOptions } from "@/features/project-members";
import { getProjectPermissions } from "@/features/projects";
import { taskConfigQueries } from "@/features/task-config";
import {
	TaskDetailView,
	taskActivitiesQueryOptions,
	taskQueryOptions,
	tasksQueryOptions,
} from "@/features/tasks";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/tasks/$taskId",
)({
	validateSearch: z.object({
		redirect_to: z.string().optional(),
		parent_task_id: z.string().optional(),
	}),
	loader: async ({ context, params }) => {
		const { projectId, taskId } = params;
		const commonParams = { page: 1, page_size: "all" } as const;
		const taskListParams = {
			ordering: "-id",
			page: 1,
			page_size: "all",
			is_deleted__eq: false,
		} as const;

		// Standard Loader Prefetching Pattern from Rule 1
		await Promise.all([
			context.queryClient.ensureQueryData(taskQueryOptions(projectId, taskId)),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				tasksQueryOptions(projectId, taskListParams),
			),
			context.queryClient.ensureQueryData(
				taskConfigQueries.statuses(projectId, commonParams),
			),
			context.queryClient.ensureQueryData(
				taskConfigQueries.types(projectId, commonParams),
			),
			context.queryClient.ensureQueryData(
				taskConfigQueries.priorities(projectId, commonParams),
			),
			context.queryClient.ensureQueryData(
				projectMembersQueryOptions(projectId),
			),
		]);
		void context.queryClient.prefetchQuery(taskActivitiesQueryOptions(taskId));
	},
	component: TaskDetailPageOrchestrator,
	staticData: {
		fixedHeight: false,
		hideViewModes: true,
	},
});

function TaskDetailPageOrchestrator() {
	const { projectId, taskId } = Route.useParams();
	const commonParams = { page: 1, page_size: "all" } as const;
	const taskListParams = {
		ordering: "-id",
		page: 1,
		page_size: "all",
		is_deleted__eq: false,
	} as const;

	// Using React Suspense Queries ensures safe immediate state access since data preloaded above
	const [
		taskRes,
		currentUserRes,
		tasksRes,
		statusesRes,
		typesRes,
		prioritiesRes,
		membersRes,
	] = useSuspenseQueries({
		queries: [
			taskQueryOptions(projectId, taskId),
			userMeQueryOptions(),
			tasksQueryOptions(projectId, taskListParams),
			taskConfigQueries.statuses(projectId, commonParams),
			taskConfigQueries.types(projectId, commonParams),
			taskConfigQueries.priorities(projectId, commonParams),
			projectMembersQueryOptions(projectId),
		],
	});

	const task = taskRes.data;
	const activitiesQuery = useQuery(taskActivitiesQueryOptions(taskId));
	const currentUser = currentUserRes.data;
	const statuses = statusesRes.data?.founds ?? [];
	const types = typesRes.data?.founds ?? [];
	const priorities = prioritiesRes.data?.founds ?? [];
	const members = membersRes.data?.founds ?? [];
	const parentTaskOptions = tasksRes.data?.founds ?? [];
	const permissions = getProjectPermissions({ members }, currentUser?.id);

	const taskOptions = useMemo(
		() => ({
			statuses,
			types,
			priorities,
			members,
		}),
		[statuses, types, priorities, members],
	);

	if (!task) return <div>Task not found</div>;

	return (
		<TaskDetailView
			task={task}
			options={taskOptions}
			parentTaskOptions={parentTaskOptions}
			activities={activitiesQuery.data ?? []}
			isActivitiesLoading={activitiesQuery.isLoading}
			isActivitiesError={activitiesQuery.isError}
			activitiesError={activitiesQuery.error}
			canManageTasks={permissions.canManageTasks}
		/>
	);
}
