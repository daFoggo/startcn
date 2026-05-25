import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	TeamMemberList,
	teamMembersQueryOptions,
} from "@/features/team-members";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute("/dashboard/$teamId/team/members")({
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				teamMembersQueryOptions(params.teamId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]),
	component: TeamMembersView,
});

function TeamMembersView() {
	const { teamId } = Route.useParams();
	const [membersRes, currentUserRes] = useSuspenseQueries({
		queries: [teamMembersQueryOptions(teamId), userMeQueryOptions()],
	});

	return (
		<TeamMemberList
			members={membersRes.data?.founds ?? []}
			currentUserId={currentUserRes.data?.id}
		/>
	);
}
