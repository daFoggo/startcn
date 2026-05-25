import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$teamId/projects/$projectId/")(
	{
		beforeLoad: ({ params }) => {
			throw redirect({
				to: "/dashboard/$teamId/projects/$projectId/dashboard",
				params: { teamId: params.teamId, projectId: params.projectId },
				replace: true,
			});
		},
	},
);
