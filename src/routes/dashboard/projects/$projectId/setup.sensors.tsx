import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	projectByIdQueryOptions,
	ResidentProjectSensors,
} from "@/features/projects";

export const Route = createFileRoute(
	"/dashboard/projects/$projectId/setup/sensors",
)({
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);
	},
	component: ProjectSensorsRoute,
	staticData: {
		getTitle: () => "Sensors",
	},
});

function ProjectSensorsRoute() {
	const { projectId } = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectByIdQueryOptions(projectId),
	);

	return <ResidentProjectSensors project={project} />;
}
