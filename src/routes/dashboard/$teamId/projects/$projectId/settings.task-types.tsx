import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { TaskTypeList, taskConfigQueries } from "@/features/task-config";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/settings/task-types",
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				projectQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				taskConfigQueries.types(params.projectId, {
					page: 1,
					page_size: "all",
					ordering: "order",
				}),
			),
		]),
	component: ProjectTaskTypesSettingsPage,
});

function ProjectTaskTypesSettingsPage() {
	const { projectId } = Route.useParams();
	const [projectRes, currentUserRes, typesRes] = useSuspenseQueries({
		queries: [
			projectQueryOptions(projectId),
			userMeQueryOptions(),
			taskConfigQueries.types(projectId, {
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
		<TaskTypeList
			projectId={projectId}
			types={typesRes.data.founds}
			canManageProject={permissions.canManageProject}
		/>
	);
}
