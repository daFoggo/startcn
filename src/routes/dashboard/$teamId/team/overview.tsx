import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$teamId/team/overview")({
	component: TeamOverviewView,
});

function TeamOverviewView() {
	return (
		<div className="flex flex-col gap-4 py-8 text-center">
			<h3 className="text-lg font-medium">Team Overview</h3>
			<p className="text-muted-foreground">
				Summary of team activities and projects will appear here.
			</p>
		</div>
	);
}
