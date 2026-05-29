import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	projectByIdQueryOptions,
	ResidentProjectDashboard,
} from "@/features/projects";

export const Route = createFileRoute("/dashboard/projects/$projectId/home")({
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);
	},
	component: ProjectHomeRoute,
	staticData: {
		getTitle: () => "Dashboard",
	},
});

function ProjectHomeRoute() {
	const { projectId } = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectByIdQueryOptions(projectId),
	);

	return <ResidentProjectDashboard project={project} />;
}
