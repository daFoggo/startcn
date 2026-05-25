import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { taskKeys } from "../tasks/queries";
import {
	analyzeProjectRiskFn,
	analyzeTaskRiskFn,
	fetchProjectRiskStatsFn,
} from "./functions";

export const agentKeys = {
	all: ["agent"] as const,
	projectRisk: (projectId: string) =>
		[...agentKeys.all, "project-risk", projectId] as const,
};

export const projectRiskStatsQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: agentKeys.projectRisk(projectId),
		queryFn: () => fetchProjectRiskStatsFn({ data: { projectId } }),
	});

export const useAgentMutations = () => {
	const queryClient = useQueryClient();

	const analyzeRisk = useMutation({
		mutationFn: (data: { projectId: string; taskId: string }) =>
			analyzeTaskRiskFn({ data: { taskId: data.taskId } }),
		onSuccess: async (_, variables) => {
			// Invalidate các query của task để cập nhật UI
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: taskKeys.detail(variables.projectId, variables.taskId),
				}),
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: agentKeys.projectRisk(variables.projectId),
				}),
			]);
		},
	});

	const analyzeProjectRisk = useMutation({
		mutationFn: (data: { projectId: string }) =>
			analyzeProjectRiskFn({ data: { projectId: data.projectId } }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: taskKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: agentKeys.projectRisk(variables.projectId),
				}),
			]);
		},
	});

	return { analyzeRisk, analyzeProjectRisk };
};
