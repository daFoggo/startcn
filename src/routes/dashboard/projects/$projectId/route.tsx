import { createFileRoute, Outlet } from "@tanstack/react-router";
import { projectByIdQueryOptions } from "@/features/projects";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
	loader: async ({ context, params }) => {
		const project = await context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);

		return { project };
	},
	component: ProjectLayoutRoute,
	staticData: {
		getTitle: () => "Project",
		pageContainerSize: "default",
	},
});

function ProjectLayoutRoute() {
	return <Outlet />;
}
