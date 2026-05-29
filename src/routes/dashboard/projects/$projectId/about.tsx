import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	projectByIdQueryOptions,
	ResidentAboutProject,
} from "@/features/projects";

export const Route = createFileRoute("/dashboard/projects/$projectId/about")({
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);
	},
	component: ProjectAboutRoute,
	staticData: {
		getTitle: () => "About Project",
	},
});

function ProjectAboutRoute() {
	const { projectId } = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectByIdQueryOptions(projectId),
	);

	return <ResidentAboutProject project={project} />;
}
