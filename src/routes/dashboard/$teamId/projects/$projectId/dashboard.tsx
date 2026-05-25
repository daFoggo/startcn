import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	ProjectRiskDashboard,
	projectRiskStatsQueryOptions,
} from "@/features/agent";
import {
	ProjectStatusUpdate,
	ProjectTaskStatsCard,
	ProjectWorkload,
	projectRecentStatusUpdatesQueryOptions,
	projectTaskStatsQueryOptions,
	projectWorkloadQueryOptions,
	type TStatsPeriod,
} from "@/features/projects";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/dashboard",
)({
	loader: ({ params, context }) => {
		const { projectId } = params;
		void context.queryClient.prefetchQuery(
			projectTaskStatsQueryOptions(projectId, "weekly"),
		);
		void context.queryClient.prefetchQuery(
			projectWorkloadQueryOptions(projectId, "weekly"),
		);
		void context.queryClient.prefetchQuery(
			projectRecentStatusUpdatesQueryOptions(projectId, 15),
		);
		void context.queryClient.prefetchQuery(
			projectRiskStatsQueryOptions(projectId),
		);
	},
	component: ProjectDashboardView,
});

function ProjectDashboardView() {
	const { projectId } = Route.useParams();
	const [taskStatsPeriod, setTaskStatsPeriod] =
		useState<TStatsPeriod>("weekly");
	const [workloadPeriod, setWorkloadPeriod] = useState<TStatsPeriod>("weekly");
	const taskStatsQuery = useQuery(
		projectTaskStatsQueryOptions(projectId, taskStatsPeriod),
	);
	const workloadQuery = useQuery(
		projectWorkloadQueryOptions(projectId, workloadPeriod),
	);
	const recentUpdatesQuery = useQuery(
		projectRecentStatusUpdatesQueryOptions(projectId, 15),
	);
	const riskStatsQuery = useQuery(projectRiskStatsQueryOptions(projectId));

	return (
		<div className="flex flex-col gap-4">
			{/* AI Risk Analysis Center (New Feature) */}
			<ProjectRiskDashboard
				projectId={projectId}
				riskStats={riskStatsQuery.data}
				isLoading={riskStatsQuery.isLoading}
				isError={riskStatsQuery.isError}
				error={riskStatsQuery.error}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-5 auto-rows-max">
				<div className="grid gap-4 lg:col-span-3">
					<ProjectTaskStatsCard
						stats={taskStatsQuery.data}
						period={taskStatsPeriod}
						onPeriodChange={setTaskStatsPeriod}
						isLoading={taskStatsQuery.isLoading}
						isError={taskStatsQuery.isError}
						error={taskStatsQuery.error}
					/>
					<ProjectWorkload
						workloadData={workloadQuery.data}
						period={workloadPeriod}
						onPeriodChange={setWorkloadPeriod}
						isLoading={workloadQuery.isLoading}
						isError={workloadQuery.isError}
						error={workloadQuery.error}
					/>
				</div>
				<div className="flex flex-col gap-4 lg:col-span-2">
					<ProjectStatusUpdate
						items={recentUpdatesQuery.data ?? []}
						isLoading={recentUpdatesQuery.isLoading}
						isError={recentUpdatesQuery.isError}
						error={recentUpdatesQuery.error}
					/>
				</div>
			</div>
		</div>
	);
}
