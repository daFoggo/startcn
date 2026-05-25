import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useDeferredValue, useState } from "react";
import { NestedErrorFallback } from "@/components/common/error-pages";
import { ViewModeList } from "@/components/layout/app/view-mode-list";
import { TEAM_VIEW_MODE_CATALOG } from "@/constants/view-mode-list";
import {
	InviteTeamMemberDialog,
	teamMembersQueryOptions,
} from "@/features/team-members";
import {
	getTeamPermissions,
	TeamDetailsHeader,
	teamQueryOptions,
} from "@/features/teams";
import { searchUsersQueryOptions, userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute("/dashboard/$teamId/team")({
	errorComponent: NestedErrorFallback,
	loader: async ({ context, params }) => {
		const team = await context.queryClient.ensureQueryData(
			teamQueryOptions(params.teamId),
		);
		await Promise.all([
			context.queryClient.ensureQueryData(
				teamMembersQueryOptions(params.teamId),
			),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]);
		return team;
	},
	component: RouteComponent,
	staticData: {
		getTitle: () => "Team Details",
		header: {
			render: () => <HeaderWrapper />,
		},
	},
});

function HeaderWrapper() {
	const { teamId } = Route.useParams();
	const team = Route.useLoaderData();
	const [inviteOpen, setInviteOpen] = useState(false);
	const [inviteSearchQuery, setInviteSearchQuery] = useState("");
	const deferredInviteSearchQuery = useDeferredValue(inviteSearchQuery);
	const { data: currentUser } = useSuspenseQuery(userMeQueryOptions());
	const { data: membersData } = useSuspenseQuery(
		teamMembersQueryOptions(teamId),
	);
	const inviteSearch = useQuery(
		searchUsersQueryOptions(deferredInviteSearchQuery, {
			excludeTeamId: teamId,
		}),
	);

	return (
		<>
			<TeamDetailsHeader
				team={team}
				members={membersData?.founds ?? []}
				currentUser={currentUser}
				onInviteMembers={() => setInviteOpen(true)}
			/>
			<InviteTeamMemberDialog
				teamId={team.id}
				open={inviteOpen}
				onOpenChange={setInviteOpen}
				users={inviteSearch.data ?? []}
				isUsersLoading={inviteSearch.isLoading}
				isUsersError={inviteSearch.isError}
				usersError={inviteSearch.error}
				onSearchQueryChange={setInviteSearchQuery}
			/>
		</>
	);
}

function RouteComponent() {
	const { teamId } = Route.useParams();
	const { data: currentUser } = useSuspenseQuery(userMeQueryOptions());
	const { data: membersData } = useSuspenseQuery(
		teamMembersQueryOptions(teamId),
	);
	const permissions = getTeamPermissions(
		membersData?.founds ?? [],
		currentUser?.id,
	);
	const catalog = permissions.canManageTeam
		? TEAM_VIEW_MODE_CATALOG
		: TEAM_VIEW_MODE_CATALOG.filter((mode) => mode.value !== "settings");

	return (
		<div className="flex flex-col gap-4">
			<ViewModeList
				catalog={catalog}
				scope="team"
				params={{ teamId }}
				allowCustomization={false}
			/>
			<Outlet />
		</div>
	);
}
