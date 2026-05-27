import { IconUsersGroup } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/dashboard/team/")({
	component: TeamPlaceholder,
	staticData: {
		getTitle: () => "My Team",
	},
});

function TeamPlaceholder() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconUsersGroup />
				</EmptyMedia>
				<EmptyTitle>Team Page</EmptyTitle>
				<EmptyDescription>
					This is a placeholder page for team details.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
