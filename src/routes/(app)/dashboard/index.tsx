import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/")({
	beforeLoad: () => {
		throw redirect({ to: "/dashboard/overview" });
	},
	component: DashboardPage,
});

function DashboardPage() {
	return null;
}
