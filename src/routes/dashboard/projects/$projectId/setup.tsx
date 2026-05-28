import { IconAdjustments } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/dashboard/projects/$projectId/setup")({
	component: ProjectSetupRoute,
	staticData: {
		getTitle: () => "Setup",
	},
});

function ProjectSetupRoute() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconAdjustments />
				</EmptyMedia>
				<EmptyTitle>Setup</EmptyTitle>
				<EmptyDescription>
					Project configuration content will be connected here.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<p className="text-sm text-muted-foreground">
					Use this section for annotation schema, data source, and team
					settings.
				</p>
			</EmptyContent>
		</Empty>
	);
}
