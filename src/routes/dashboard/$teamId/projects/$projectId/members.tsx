import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/members",
)({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/dashboard/$teamId/projects/$projectId/settings/members",
			params: { teamId: params.teamId, projectId: params.projectId },
			replace: true,
		});
	},
});
