import { Loader2, RefreshCw, TriangleAlertIcon } from "lucide-react";
import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { useAgentMutations } from "../queries";
import type { TProjectRiskStats } from "../schemas";
import { ProjectRiskGauge } from "./project-risk-gauge";
import { RiskDriversChart } from "./risk-drivers-chart";
import { RiskMatrixChart } from "./risk-matrix-chart";

interface IProjectRiskDashboardProps {
	projectId: string;
	riskStats?: TProjectRiskStats;
	isLoading?: boolean;
	isError?: boolean;
	error?: unknown;
}

export const ProjectRiskDashboard = memo(
	({
		projectId,
		riskStats,
		isLoading = false,
		isError = false,
		error,
	}: IProjectRiskDashboardProps) => {
		const { analyzeProjectRisk } = useAgentMutations();

		const handleAnalyzeAll = () => {
			analyzeProjectRisk.mutate({ projectId });
		};

		if (isLoading) {
			return (
				<div className="col-span-full space-y-4">
					<div className="flex items-center justify-between">
						<Skeleton className="h-8 w-36 rounded" />
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						<Skeleton className="col-span-1 h-62.5 rounded-xl" />
						<Skeleton className="col-span-1 h-62.5 rounded-xl md:col-span-2" />
						<Skeleton className="col-span-1 h-62.5 rounded-xl" />
					</div>
				</div>
			);
		}

		if (isError) {
			return (
				<div className="col-span-full p-4">
					<Alert variant="destructive">
						<TriangleAlertIcon className="size-4" />
						<AlertTitle>Error loading risk data</AlertTitle>
						<AlertDescription>
							{getErrorMessage(
								error,
								"An error occurred while retrieving project risk assessments.",
							)}
						</AlertDescription>
					</Alert>
				</div>
			);
		}

		if (!riskStats) return null;

		return (
			<div className="col-span-full space-y-4">
				<div className="flex items-center justify-between">
					<Button
						onClick={handleAnalyzeAll}
						disabled={analyzeProjectRisk.isPending}
						size="sm"
						className="gap-2"
					>
						{analyzeProjectRisk.isPending ? (
							<Loader2 className="size-3.5 animate-spin" />
						) : (
							<RefreshCw className="size-3.5" />
						)}
						{analyzeProjectRisk.isPending
							? "Analyzing..."
							: "Review Project Risk"}
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
					<ProjectRiskGauge overallRiskIndex={riskStats.overall_risk_index} />
					<RiskMatrixChart tasks={riskStats.tasks} />
					<RiskDriversChart tasks={riskStats.tasks} />
				</div>
			</div>
		);
	},
);

ProjectRiskDashboard.displayName = "ProjectRiskDashboard";
