import { createFileRoute, Outlet } from "@tanstack/react-router";
import { projectByIdQueryOptions } from "@/features/projects";

export const Route = createFileRoute("/dashboard/projects/$projectId/setup")({
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);
	},
	component: ProjectSetupLayoutRoute,
	staticData: {
		getTitle: () => "Configuration",
	},
});

function ProjectSetupLayoutRoute() {
	return <Outlet />;
}
