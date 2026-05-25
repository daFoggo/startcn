import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { TaskStatusList, taskConfigQueries } from "@/features/task-config";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/settings/task-statuses",
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				projectQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				taskConfigQueries.statuses(params.projectId, {
					page: 1,
					page_size: "all",
					ordering: "order",
				}),
			),
		]),
	component: ProjectTaskStatusesSettingsPage,
});

function ProjectTaskStatusesSettingsPage() {
	const { projectId } = Route.useParams();
	const [projectRes, currentUserRes, statusesRes] = useSuspenseQueries({
		queries: [
			projectQueryOptions(projectId),
			userMeQueryOptions(),
			taskConfigQueries.statuses(projectId, {
				page: 1,
				page_size: "all",
				ordering: "order",
			}),
		],
	});
	const permissions = getProjectPermissions(
		projectRes.data,
		currentUserRes.data?.id,
	);

	return (
		<TaskStatusList
			projectId={projectId}
			statuses={statusesRes.data.founds}
			canManageProject={permissions.canManageProject}
		/>
	);
}
