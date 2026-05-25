import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$teamId/team/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/dashboard/$teamId/team/members",
			params: { teamId: params.teamId },
			replace: true,
		});
	},
});
