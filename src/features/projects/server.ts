import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { z } from "zod";
import type {
	CreateProjectSchema,
	TGetProjectsInput,
	TProject,
	TProjectsResponse,
	TProjectTaskStats,
	TProjectWorkloadResponse,
	TStatsPeriod,
	TTaskActivity,
	UpdateProjectSchema,
} from "./schemas";

/**
 * Lấy danh sách các Project hiện có, hỗ trợ filter và pagination.
 */
export async function fetchProjects(
	params?: TGetProjectsInput,
): Promise<TProjectsResponse> {
	const response = await api
		.get("projects", {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TProjectsResponse>>();

	return response.data;
}

/**
 * Lấy danh sách các Project mà người dùng hiện tại đang tham gia.
 */
export async function fetchMyProjects(teamId?: string): Promise<TProject[]> {
	const response = await api
		.get("projects/me", {
			searchParams: teamId ? { team_id: teamId } : {},
		})
		.json<TBaseResponse<TProject[]>>();
	return response.data;
}

/**
 * Lấy thông tin chi tiết của một Project theo ID.
 */
export async function fetchProjectById(projectId: string): Promise<TProject> {
	const response = await api
		.get(`projects/${projectId}`)
		.json<TBaseResponse<TProject>>();
	return response.data;
}

/**
 * Tạo một Project mới.
 */
export async function createProject(
	payload: z.infer<typeof CreateProjectSchema>,
): Promise<TProject> {
	const response = await api
		.post("projects", { json: payload })
		.json<TBaseResponse<TProject>>();

	return response.data;
}

/**
 * Cập nhật thông tin (name, description, etc.) của một Project.
 */
export async function updateProject(
	projectId: string,
	payload: z.infer<typeof UpdateProjectSchema>,
): Promise<TProject> {
	const response = await api
		.patch(`projects/${projectId}`, { json: payload })
		.json<TBaseResponse<TProject>>();

	return response.data;
}

/**
 * Thực hiện xóa Project (thường là Soft Delete).
 */
export async function deleteProject(projectId: string): Promise<boolean> {
	const response = await api
		.delete(`projects/${projectId}`)
		.json<TBaseResponse<boolean>>();
	return response.data;
}

/**
 * Lấy thống kê task của project (by priority/status/type) — dùng cho biểu đồ ProjectTaskStatsCard.
 */
export async function fetchProjectTaskStats(
	projectId: string,
	period: TStatsPeriod = "weekly",
): Promise<TProjectTaskStats> {
	const response = await api
		.get(`projects/${projectId}/tasks/stats`, { searchParams: { period } })
		.json<TBaseResponse<TProjectTaskStats>>();
	return response.data;
}

/**
 * Lấy workload của từng member trong project theo ngày — dùng cho biểu đồ ProjectWorkload.
 */
export async function fetchProjectMemberWorkload(
	projectId: string,
	period: TStatsPeriod = "weekly",
): Promise<TProjectWorkloadResponse> {
	const response = await api
		.get(`projects/${projectId}/members/workload`, { searchParams: { period } })
		.json<TBaseResponse<TProjectWorkloadResponse>>();
	return response.data;
}

/**
 * Lấy lịch sử cập nhật trạng thái gần đây của dự án.
 */
export async function fetchProjectRecentStatusUpdates(
	projectId: string,
	limit: number = 10,
): Promise<TTaskActivity[]> {
	const response = await api
		.get(`projects/${projectId}/tasks/recent-updates`, {
			searchParams: { limit },
		})
		.json<TBaseResponse<TTaskActivity[]>>();
	return response.data;
}
