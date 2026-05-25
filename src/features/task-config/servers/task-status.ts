import "@tanstack/react-start/server-only";
import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import {
	TaskStatusCreateSchema,
	TaskStatusUpdateSchema,
	type TTaskStatus,
	type TTaskStatusCreateInput,
	type TTaskStatusesResponse,
	type TTaskStatusFindInput,
	type TTaskStatusUpdateInput,
} from "../schemas";

import { buildSectionPath } from "./base";

export async function fetchTaskStatuses(
	projectId: string,
	params?: TTaskStatusFindInput,
): Promise<TTaskStatusesResponse> {
	const response = await api
		.get(buildSectionPath(projectId, "statuses"), {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TTaskStatusesResponse>>();

	return response.data;
}

export async function fetchTaskStatusById(
	projectId: string,
	statusId: string,
): Promise<TTaskStatus> {
	const response = await api
		.get(`${buildSectionPath(projectId, "statuses")}/${statusId}`)
		.json<TBaseResponse<TTaskStatus>>();
	return response.data;
}

export async function createTaskStatus(
	projectId: string,
	payload: TTaskStatusCreateInput,
): Promise<TTaskStatus> {
	const response = await api
		.post(buildSectionPath(projectId, "statuses"), {
			json: TaskStatusCreateSchema.parse({
				...payload,
				project_id: projectId,
			}),
		})
		.json<TBaseResponse<TTaskStatus>>();

	return response.data;
}

export async function updateTaskStatus(
	projectId: string,
	statusId: string,
	payload: TTaskStatusUpdateInput,
): Promise<TTaskStatus> {
	const response = await api
		.patch(`${buildSectionPath(projectId, "statuses")}/${statusId}`, {
			json: TaskStatusUpdateSchema.parse(payload),
		})
		.json<TBaseResponse<TTaskStatus>>();

	return response.data;
}

export async function deleteTaskStatus(
	projectId: string,
	statusId: string,
): Promise<boolean> {
	const response = await api
		.delete(`${buildSectionPath(projectId, "statuses")}/${statusId}`)
		.json<TBaseResponse<boolean>>();

	return response.data;
}
