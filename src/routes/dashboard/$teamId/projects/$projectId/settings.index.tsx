import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectSettings, projectQueryOptions } from "@/features/projects";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/settings/",
)({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				projectQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]);
	},
	component: ProjectSettingsGeneralPage,
});

function ProjectSettingsGeneralPage() {
	const { teamId, projectId } = Route.useParams();
	const [projectRes, currentUserRes] = useSuspenseQueries({
		queries: [projectQueryOptions(projectId), userMeQueryOptions()],
	});

	return (
		<ProjectSettings
			teamId={teamId}
			projectId={projectId}
			project={projectRes.data}
			currentUser={currentUserRes.data}
		/>
	);
}
