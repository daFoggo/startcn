import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { TProjectRiskStats, TRiskSnapshot } from "./schemas";

export async function analyzeTaskRisk(taskId: string): Promise<TRiskSnapshot> {
	const response = await api
		.post(`agent/tasks/${taskId}/risk-analyses`)
		.json<TBaseResponse<TRiskSnapshot>>();
	return response.data;
}

export async function analyzeProjectRisk(
	projectId: string,
): Promise<{ analyzed_count: number }> {
	const response = await api
		.post(`agent/projects/${projectId}/risk-analyses`)
		.json<TBaseResponse<{ analyzed_count: number }>>();
	return response.data;
}

export async function triggerAgentOutreach(): Promise<{ status: string }> {
	const response = await api
		.post("agent/outreaches")
		.json<TBaseResponse<{ status: string }>>();
	return response.data;
}

export async function fetchProjectRiskStats(
	projectId: string,
): Promise<TProjectRiskStats> {
	const response = await api
		.get(`projects/${projectId}/tasks/risk-stats`)
		.json<TBaseResponse<TProjectRiskStats>>();
	return response.data;
}
