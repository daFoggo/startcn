import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { projectByIdQueryOptions } from "@/features/projects";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
	loader: async ({ context, params }) => {
		const project = await context.queryClient.ensureQueryData(
			projectByIdQueryOptions(params.projectId),
		);

		return { project };
	},
	component: ProjectDetailRoute,
	staticData: {
		getTitle: () => "Project details",
		hideSidebar: true,
		pageContainerSize: "default",
	},
});

function ProjectDetailRoute() {
	const { project } = Route.useLoaderData();

	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyTitle>{project.name}</EmptyTitle>
				<EmptyDescription>
					Project detail workspace will be connected when project data is
					available.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<p className="text-sm text-muted-foreground">
					This route is ready for project-specific annotation configuration,
					conversation queues, and context dashboards.
				</p>
			</EmptyContent>
		</Empty>
	);
}
