import "@tanstack/react-start/server-only";
import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import {
	TaskPriorityCreateSchema,
	TaskPriorityUpdateSchema,
	type TTaskPrioritiesResponse,
	type TTaskPriority,
	type TTaskPriorityCreateInput,
	type TTaskPriorityFindInput,
	type TTaskPriorityUpdateInput,
} from "../schemas";

import { buildSectionPath } from "./base";

export async function fetchTaskPriorities(
	projectId: string,
	params?: TTaskPriorityFindInput,
): Promise<TTaskPrioritiesResponse> {
	const response = await api
		.get(buildSectionPath(projectId, "priorities"), {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TTaskPrioritiesResponse>>();

	return response.data;
}

export async function fetchTaskPriorityById(
	projectId: string,
	priorityId: string,
): Promise<TTaskPriority> {
	const response = await api
		.get(`${buildSectionPath(projectId, "priorities")}/${priorityId}`)
		.json<TBaseResponse<TTaskPriority>>();
	return response.data;
}

export async function createTaskPriority(
	projectId: string,
	payload: TTaskPriorityCreateInput,
): Promise<TTaskPriority> {
	const response = await api
		.post(buildSectionPath(projectId, "priorities"), {
			json: TaskPriorityCreateSchema.parse({
				...payload,
				project_id: projectId,
			}),
		})
		.json<TBaseResponse<TTaskPriority>>();

	return response.data;
}

export async function updateTaskPriority(
	projectId: string,
	priorityId: string,
	payload: TTaskPriorityUpdateInput,
): Promise<TTaskPriority> {
	const response = await api
		.patch(`${buildSectionPath(projectId, "priorities")}/${priorityId}`, {
			json: TaskPriorityUpdateSchema.parse(payload),
		})
		.json<TBaseResponse<TTaskPriority>>();

	return response.data;
}

export async function deleteTaskPriority(
	projectId: string,
	priorityId: string,
): Promise<boolean> {
	const response = await api
		.delete(`${buildSectionPath(projectId, "priorities")}/${priorityId}`)
		.json<TBaseResponse<boolean>>();

	return response.data;
}
