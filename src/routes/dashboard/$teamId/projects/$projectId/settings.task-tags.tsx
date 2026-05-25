import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { TaskTagList, taskConfigQueries } from "@/features/task-config";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/settings/task-tags",
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				projectQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				taskConfigQueries.tags(params.projectId, {
					page: 1,
					page_size: "all",
					ordering: "name",
				}),
			),
		]),
	component: ProjectTaskTagsSettingsPage,
});

function ProjectTaskTagsSettingsPage() {
	const { projectId } = Route.useParams();
	const [projectRes, currentUserRes, tagsRes] = useSuspenseQueries({
		queries: [
			projectQueryOptions(projectId),
			userMeQueryOptions(),
			taskConfigQueries.tags(projectId, {
				page: 1,
				page_size: "all",
				ordering: "name",
			}),
		],
	});
	const permissions = getProjectPermissions(
		projectRes.data,
		currentUserRes.data?.id,
	);

	return (
		<TaskTagList
			projectId={projectId}
			tags={tagsRes.data.founds}
			canManageProject={permissions.canManageProject}
		/>
	);
}
