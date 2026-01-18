import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/overview")({
	staticData: {
		getTitle: () => "Overview",
	},
	component: OverviewPage,
});

function OverviewPage() {
	return <div className="p-4">Hello "/(app)/dashboard/overview"!</div>;
}
