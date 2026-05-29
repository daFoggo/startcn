import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	projectByIdQueryOptions,
	ResidentAnnotationLogs,
} from "@/features/projects";

export const Route = createFileRoute(
	"/dashboard/projects/$projectId/annotation",
)({
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);
	},
	component: ProjectAnnotationRoute,
	staticData: {
		getTitle: () => "Annotation Logs",
	},
});

function ProjectAnnotationRoute() {
	const { projectId } = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectByIdQueryOptions(projectId),
	);

	return <ResidentAnnotationLogs project={project} />;
}
