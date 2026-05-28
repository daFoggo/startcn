import { IconPencil } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute(
	"/dashboard/projects/$projectId/annotation",
)({
	component: ProjectAnnotationRoute,
	staticData: {
		getTitle: () => "Annotation",
	},
});

function ProjectAnnotationRoute() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconPencil />
				</EmptyMedia>
				<EmptyTitle>Annotation</EmptyTitle>
				<EmptyDescription>
					Annotation workspace content will be connected here.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<p className="text-sm text-muted-foreground">
					Use this section for labeling queues, review workflows, and task
					progress.
				</p>
			</EmptyContent>
		</Empty>
	);
}
