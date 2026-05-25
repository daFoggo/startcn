import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { teamMembersQueryOptions } from "@/features/team-members";
import {
	myTeamsQueryOptions,
	TeamSettings,
	teamQueryOptions,
} from "@/features/teams";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute("/dashboard/$teamId/team/settings")({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(teamQueryOptions(params.teamId)),
			context.queryClient.ensureQueryData(
				teamMembersQueryOptions(params.teamId),
			),
			context.queryClient.ensureQueryData(myTeamsQueryOptions()),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]);
	},
	component: TeamSettingsView,
});

function TeamSettingsView() {
	const { teamId } = Route.useParams();
	const [teamRes, myTeamsRes, membersRes, currentUserRes] = useSuspenseQueries({
		queries: [
			teamQueryOptions(teamId),
			myTeamsQueryOptions(),
			teamMembersQueryOptions(teamId),
			userMeQueryOptions(),
		],
	});

	return (
		<TeamSettings
			teamId={teamId}
			team={teamRes.data}
			myTeams={myTeamsRes.data}
			currentUser={currentUserRes.data}
			members={membersRes.data?.founds ?? []}
		/>
	);
}
