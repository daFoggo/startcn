import type { TInvitation } from "./schemas";

export const navigateAfterInvitationAccept = (
	data: TInvitation,
	navigate: (params: any) => Promise<unknown> | undefined,
) => {
	if (data.team_id && !data.project_id) {
		return navigate({
			to: "/dashboard/$teamId/team/members",
			params: { teamId: data.team_id },
		});
	}
	if (data.project_id && data.project?.team_id) {
		return navigate({
			to: "/dashboard/$teamId/projects/$projectId/list",
			params: {
				teamId: data.project.team_id,
				projectId: data.project_id,
			},
		});
	}
	if (data.project_id && data.team_id) {
		return navigate({
			to: "/dashboard/$teamId/projects/$projectId/list",
			params: {
				teamId: data.team_id,
				projectId: data.project_id,
			},
		});
	}
	return navigate({ to: "/dashboard" });
};
