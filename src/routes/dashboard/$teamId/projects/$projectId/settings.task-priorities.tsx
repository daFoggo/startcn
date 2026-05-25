import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { TaskPriorityList, taskConfigQueries } from "@/features/task-config";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/settings/task-priorities",
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				projectQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				taskConfigQueries.priorities(params.projectId, {
					page: 1,
					page_size: "all",
					ordering: "order",
				}),
			),
		]),
	component: ProjectTaskPrioritiesSettingsPage,
});

function ProjectTaskPrioritiesSettingsPage() {
	const { projectId } = Route.useParams();
	const [projectRes, currentUserRes, prioritiesRes] = useSuspenseQueries({
		queries: [
			projectQueryOptions(projectId),
			userMeQueryOptions(),
			taskConfigQueries.priorities(projectId, {
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
		<TaskPriorityList
			projectId={projectId}
			priorities={prioritiesRes.data.founds}
			canManageProject={permissions.canManageProject}
		/>
	);
}
