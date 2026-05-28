import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { TProject, TProjectListItem } from "./schemas";

export async function listProjects(): Promise<TProjectListItem[]> {
	const response = await api
		.get("projects")
		.json<TBaseResponse<TProjectListItem[]>>();
	return response.data;
}

export async function getProjectById(projectId: string): Promise<TProject> {
	const response = await api
		.get(`projects/${projectId}`)
		.json<TBaseResponse<TProject>>();
	return response.data;
}
