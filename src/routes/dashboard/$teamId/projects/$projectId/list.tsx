import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { taskConfigQueries } from "@/features/task-config";
import { TaskTable, tasksQueryOptions } from "@/features/tasks";
import { mapTaskData } from "@/features/tasks/helpers";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/list",
)({
	loader: async ({ context, params }) => {
		const { projectId } = params;
		const commonParams = { page: 1, page_size: "all" } as const;

		await Promise.all([
			context.queryClient.ensureQueryData(projectQueryOptions(projectId)),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				tasksQueryOptions(projectId, {
					ordering: "-id",
					page: 1,
					page_size: "all",
					is_deleted__eq: false,
				}),
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
		]);
	},
	component: ProjectListView,
});

function ProjectListView() {
	const { projectId } = Route.useParams();
	const commonParams = { page: 1, page_size: "all" } as const;

	const [
		projectRes,
		currentUserRes,
		tasksResponseRes,
		statusesResponseRes,
		typesResponseRes,
		prioritiesResponseRes,
	] = useSuspenseQueries({
		queries: [
			projectQueryOptions(projectId),
			userMeQueryOptions(),
			tasksQueryOptions(projectId, {
				ordering: "-id",
				page: 1,
				page_size: "all",
				is_deleted__eq: false,
			}),
			taskConfigQueries.statuses(projectId, commonParams),
			taskConfigQueries.types(projectId, commonParams),
			taskConfigQueries.priorities(projectId, commonParams),
		],
	});

	const project = projectRes.data;
	const currentUser = currentUserRes.data;
	const tasksResponse = tasksResponseRes.data;
	const statusesResponse = statusesResponseRes.data;
	const typesResponse = typesResponseRes.data;
	const prioritiesResponse = prioritiesResponseRes.data;

	const sortedStatuses = useMemo(() => {
		return [...statusesResponse.founds].sort((a, b) => a.order - b.order);
	}, [statusesResponse]);

	const sortedTypes = useMemo(() => {
		return [...typesResponse.founds].sort((a, b) => a.order - b.order);
	}, [typesResponse]);

	const sortedPriorities = useMemo(() => {
		return [...prioritiesResponse.founds].sort((a, b) => a.order - b.order);
	}, [prioritiesResponse]);

	const taskOptions = {
		statuses: sortedStatuses,
		types: sortedTypes,
		priorities: sortedPriorities,
	};
	const projectMembers = project?.members ?? [];
	const permissions = getProjectPermissions(project, currentUser?.id);

	const tasks = tasksResponse.founds.map((task) =>
		mapTaskData(task, taskOptions),
	);

	return (
		<TaskTable
			projectId={projectId}
			data={tasks}
			members={projectMembers}
			statuses={taskOptions.statuses}
			types={taskOptions.types}
			priorities={taskOptions.priorities}
			groupBy="status"
			canManageTasks={permissions.canManageTasks}
		/>
	);
}
