import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects/$projectId/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/dashboard/projects/$projectId/home",
			params: {
				projectId: params.projectId,
			},
			replace: true,
		});
	},
});
