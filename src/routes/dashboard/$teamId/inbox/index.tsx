import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$teamId/inbox/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/dashboard/$teamId/inbox/active",
			params: { teamId: params.teamId },
			replace: true,
		});
	},
});
