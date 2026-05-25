import "@tanstack/react-start/server-only";
import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import {
	TaskTagCreateSchema,
	TaskTagUpdateSchema,
	type TTaskTag,
	type TTaskTagCreateInput,
	type TTaskTagFindInput,
	type TTaskTagsResponse,
	type TTaskTagUpdateInput,
} from "../schemas";

import { buildSectionPath } from "./base";

export async function fetchTaskTags(
	projectId: string,
	params?: TTaskTagFindInput,
): Promise<TTaskTagsResponse> {
	const response = await api
		.get(buildSectionPath(projectId, "tags"), {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TTaskTagsResponse>>();

	return response.data;
}

export async function fetchTaskTagById(
	projectId: string,
	tagId: string,
): Promise<TTaskTag> {
	const response = await api
		.get(`${buildSectionPath(projectId, "tags")}/${tagId}`)
		.json<TBaseResponse<TTaskTag>>();
	return response.data;
}

export async function createTaskTag(
	projectId: string,
	payload: TTaskTagCreateInput,
): Promise<TTaskTag> {
	const response = await api
		.post(buildSectionPath(projectId, "tags"), {
			json: TaskTagCreateSchema.parse({
				...payload,
				project_id: projectId,
			}),
		})
		.json<TBaseResponse<TTaskTag>>();

	return response.data;
}

export async function updateTaskTag(
	projectId: string,
	tagId: string,
	payload: TTaskTagUpdateInput,
): Promise<TTaskTag> {
	const response = await api
		.patch(`${buildSectionPath(projectId, "tags")}/${tagId}`, {
			json: TaskTagUpdateSchema.parse(payload),
		})
		.json<TBaseResponse<TTaskTag>>();

	return response.data;
}

export async function deleteTaskTag(
	projectId: string,
	tagId: string,
): Promise<boolean> {
	const response = await api
		.delete(`${buildSectionPath(projectId, "tags")}/${tagId}`)
		.json<TBaseResponse<boolean>>();

	return response.data;
}
