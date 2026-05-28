import { IconHome } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/dashboard/projects/$projectId/home")({
	component: ProjectHomeRoute,
	staticData: {
		getTitle: () => "Home",
	},
});

function ProjectHomeRoute() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconHome />
				</EmptyMedia>
				<EmptyTitle>Home</EmptyTitle>
				<EmptyDescription>
					Project overview content will be connected here.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<p className="text-sm text-muted-foreground">
					Use this section for project status, recent activity, and annotation
					progress.
				</p>
			</EmptyContent>
		</Empty>
	);
}
