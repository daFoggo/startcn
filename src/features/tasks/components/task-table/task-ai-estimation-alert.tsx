import { Sparkles } from "lucide-react";
import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { TTaskAIEstimationExplanation } from "../../schemas";

interface ITaskAIEstimationAlertProps {
	aiExplanation: TTaskAIEstimationExplanation | null;
}

export const TaskAIEstimationAlert = memo(
	({ aiExplanation }: ITaskAIEstimationAlertProps) => {
		if (!aiExplanation) return null;

		return (
			<Alert>
				<Sparkles className="size-4" />
				<AlertTitle>Estimated Hours Explanation</AlertTitle>
				<AlertDescription className="text-xs flex flex-col gap-1">
					<span className="w-full">{aiExplanation.rationale}</span>
					{aiExplanation.reasoning_steps && (
						<div className="flex flex-col gap-1 w-full">
							{aiExplanation.similar_cases_count !== undefined && (
								<span className="w-full">
									<strong>Similar Cases Analyzed:</strong>{" "}
									{aiExplanation.similar_cases_count}
								</span>
							)}
							{aiExplanation.reasoning_steps.similarity_analysis && (
								<span className="w-full">
									<strong>Similarity:</strong>{" "}
									{aiExplanation.reasoning_steps.similarity_analysis}
								</span>
							)}
							{aiExplanation.reasoning_steps.variance_analysis && (
								<span className="w-full">
									<strong>Accuracy:</strong>{" "}
									{aiExplanation.reasoning_steps.variance_analysis}
								</span>
							)}
						</div>
					)}
				</AlertDescription>
			</Alert>
		);
	},
);

TaskAIEstimationAlert.displayName = "TaskAIEstimationAlert";

export const TaskAIEstimationAlertSkeleton = memo(() => {
	return (
		<Alert>
			<Sparkles className="size-4" />
			<AlertTitle>Estimated Hours Explanation</AlertTitle>
			<AlertDescription className="flex flex-col gap-2">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-11/12" />
				<div className="flex flex-col gap-1 pt-1">
					<Skeleton className="h-3 w-52" />
					<Skeleton className="h-3 w-64" />
					<Skeleton className="h-3 w-56" />
				</div>
			</AlertDescription>
		</Alert>
	);
});

TaskAIEstimationAlertSkeleton.displayName = "TaskAIEstimationAlertSkeleton";
