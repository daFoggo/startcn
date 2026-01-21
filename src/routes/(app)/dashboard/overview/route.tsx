import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/layouts/dashboard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(app)/dashboard/overview")({
	staticData: {
		getTitle: () => "Overview",
	},
	component: OverviewPage,
});

function OverviewPage() {
	return (
		<div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
			<PageTitle
				title="Overview"
				subTitle="View summary information of your system"
			/>
			<Button
				onClick={() => {
					throw new Error("This is your first error!");
				}}
			>
				Break the world
			</Button>
		</div>
	);
}
