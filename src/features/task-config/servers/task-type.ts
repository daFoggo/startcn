import "@tanstack/react-start/server-only";
import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import {
	TaskTypeCreateSchema,
	TaskTypeUpdateSchema,
	type TTaskType,
	type TTaskTypeCreateInput,
	type TTaskTypeFindInput,
	type TTaskTypesResponse,
	type TTaskTypeUpdateInput,
} from "../schemas";

import { buildSectionPath } from "./base";

export async function fetchTaskTypes(
	projectId: string,
	params?: TTaskTypeFindInput,
): Promise<TTaskTypesResponse> {
	const response = await api
		.get(buildSectionPath(projectId, "types"), {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TTaskTypesResponse>>();

	return response.data;
}

export async function fetchTaskTypeById(
	projectId: string,
	typeId: string,
): Promise<TTaskType> {
	const response = await api
		.get(`${buildSectionPath(projectId, "types")}/${typeId}`)
		.json<TBaseResponse<TTaskType>>();
	return response.data;
}

export async function createTaskType(
	projectId: string,
	payload: TTaskTypeCreateInput,
): Promise<TTaskType> {
	const response = await api
		.post(buildSectionPath(projectId, "types"), {
			json: TaskTypeCreateSchema.parse({
				...payload,
				project_id: projectId,
			}),
		})
		.json<TBaseResponse<TTaskType>>();

	return response.data;
}

export async function updateTaskType(
	projectId: string,
	typeId: string,
	payload: TTaskTypeUpdateInput,
): Promise<TTaskType> {
	const response = await api
		.patch(`${buildSectionPath(projectId, "types")}/${typeId}`, {
			json: TaskTypeUpdateSchema.parse(payload),
		})
		.json<TBaseResponse<TTaskType>>();

	return response.data;
}

export async function deleteTaskType(
	projectId: string,
	typeId: string,
): Promise<boolean> {
	const response = await api
		.delete(`${buildSectionPath(projectId, "types")}/${typeId}`)
		.json<TBaseResponse<boolean>>();

	return response.data;
}
