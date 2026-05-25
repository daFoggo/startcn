import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { NestedErrorFallback } from "@/components/common/error-pages";
import { projectsQueryOptions } from "@/features/projects";
import { teamQueryOptions } from "@/features/teams";
import { useDashboardStore } from "@/stores/use-dashboard-store";

export const Route = createFileRoute("/dashboard/$teamId")({
	errorComponent: NestedErrorFallback,
	loader: async ({ context, params }) => {
		if (params.teamId && params.teamId !== "personal") {
			await context.queryClient.ensureQueryData(
				teamQueryOptions(params.teamId),
			);
			void context.queryClient.prefetchQuery(
				projectsQueryOptions({ team_id__eq: params.teamId }),
			);
		}
	},
	component: DashboardTeamLayout,
});

function DashboardTeamLayout() {
	const { teamId } = useParams({ from: "/dashboard/$teamId" });
	const setLastTeamId = useDashboardStore((state) => state.setLastTeamId);

	useEffect(() => {
		if (teamId && teamId !== "personal") {
			setLastTeamId(teamId);
		}
	}, [teamId, setLastTeamId]);

	return <Outlet />;
}
