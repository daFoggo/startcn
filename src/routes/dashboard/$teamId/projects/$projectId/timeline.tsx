import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/timeline",
)({
	component: ProjectTimelineView,
});

function ProjectTimelineView() {
	const { projectId } = Route.useParams();
	return <div>Project timeline: {projectId}</div>;
}
