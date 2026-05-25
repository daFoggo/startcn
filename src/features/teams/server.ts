import "@tanstack/react-start/server-only";
import type { z } from "zod";
import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import type {
	CreateTeamSchema,
	GetTeamsSchema,
	TTeam,
	TTeamsResponse,
	UpdateTeamSchema,
} from "./schemas";

/**
 * Lấy danh sách các Team trong hệ thống (hỗ trợ filter và pagination).
 */
export async function fetchTeams(
	params?: z.infer<typeof GetTeamsSchema>,
): Promise<TTeamsResponse> {
	const response = await api
		.get("teams", { searchParams: params })
		.json<TBaseResponse<TTeamsResponse>>();

	return response.data;
}

/**
 * Lấy danh sách các Team mà người dùng hiện tại đang tham gia hoặc sở hữu.
 */
export async function fetchMyTeams(): Promise<TTeam[]> {
	const response = await api.get("teams/me").json<TBaseResponse<TTeam[]>>();
	return response.data;
}

/**
 * Lấy thông tin chi tiết của một Team theo ID.
 */
export async function fetchTeamById(teamId: string): Promise<TTeam> {
	const response = await api
		.get(`teams/${teamId}`)
		.json<TBaseResponse<TTeam>>();
	return response.data;
}

/**
 * Tạo một Team mới.
 */
export async function createTeam(
	data: z.infer<typeof CreateTeamSchema>,
): Promise<TTeam> {
	const response = await api
		.post("teams", { json: data })
		.json<TBaseResponse<TTeam>>();
	return response.data;
}

/**
 * Cập nhật thông tin chi tiết của Team.
 */
export async function updateTeam(
	teamId: string,
	data: z.infer<typeof UpdateTeamSchema>,
): Promise<TTeam> {
	const response = await api
		.patch(`teams/${teamId}`, { json: data })
		.json<TBaseResponse<TTeam>>();
	return response.data;
}

/**
 * Thực hiện xóa Team khỏi hệ thống.
 */
export async function deleteTeam(teamId: string): Promise<boolean> {
	const response = await api
		.delete(`teams/${teamId}`)
		.json<TBaseResponse<boolean>>();
	return response.data;
}
