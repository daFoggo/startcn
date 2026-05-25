import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	ProjectMemberList,
	projectMembersQueryOptions,
} from "@/features/project-members";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/settings/members",
)({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				projectMembersQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(
				projectQueryOptions(params.projectId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]),
	component: ProjectSettingsMembersPage,
});

function ProjectSettingsMembersPage() {
	const { teamId, projectId } = Route.useParams();
	const [membersRes, projectRes, currentUserRes] = useSuspenseQueries({
		queries: [
			projectMembersQueryOptions(projectId),
			projectQueryOptions(projectId),
			userMeQueryOptions(),
		],
	});
	const permissions = getProjectPermissions(
		projectRes.data,
		currentUserRes.data?.id,
	);

	return (
		<ProjectMemberList
			teamId={teamId}
			members={membersRes.data?.founds ?? []}
			currentUserId={currentUserRes.data?.id}
			canManageProject={permissions.canManageProject}
		/>
	);
}
