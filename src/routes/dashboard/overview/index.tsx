import { IconLayoutDashboard } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/dashboard/overview/")({
	component: OverviewPlaceholder,
	staticData: {
		getTitle: () => "Overview",
	},
});

function OverviewPlaceholder() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconLayoutDashboard />
				</EmptyMedia>
				<EmptyTitle>Overview Page</EmptyTitle>
				<EmptyDescription>
					This is a placeholder page for the overview.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
