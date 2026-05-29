import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	projectByIdQueryOptions,
	ResidentProjectConfiguration,
} from "@/features/projects";

export const Route = createFileRoute(
	"/dashboard/projects/$projectId/setup/context",
)({
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);
	},
	component: ProjectSetupContextRoute,
	staticData: {
		getTitle: () => "Context & knowledge",
	},
});

function ProjectSetupContextRoute() {
	const { projectId } = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectByIdQueryOptions(projectId),
	);

	return <ResidentProjectConfiguration project={project} />;
}
