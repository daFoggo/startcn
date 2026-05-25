import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type {
	TAddTeamMemberPayload,
	TTeamInviteAcceptRequest,
	TTeamInviteGenerateRequest,
	TTeamInviteTokenResponse,
	TTeamMember,
	TTeamMembersResponse,
	TUpdateTeamMemberRolePayload,
} from "./schemas";

/**
 * Lấy danh sách thành viên của một Team, hỗ trợ tìm kiếm theo tên hoặc email.
 */
export async function fetchTeamMembers(params: {
	teamId: string;
	q?: string;
}): Promise<TTeamMembersResponse> {
	const { teamId, q } = params;
	const searchParams = q ? { q } : undefined;

	const response = await api
		.get(`teams/${teamId}/members`, { searchParams })
		.json<TBaseResponse<TTeamMembersResponse>>();

	return response.data;
}

/**
 * Mời hoặc thêm thành viên mới vào Team.
 */
export async function addTeamMember(
	teamId: string,
	payload: TAddTeamMemberPayload,
): Promise<TTeamMember> {
	const response = await api
		.post(`teams/${teamId}/members`, { json: payload })
		.json<TBaseResponse<TTeamMember>>();

	return response.data;
}

/**
 * Cập nhật vai trò (Role) cho thành viên trong Team.
 */
export async function updateTeamMemberRole(
	teamId: string,
	userId: string,
	payload: TUpdateTeamMemberRolePayload,
): Promise<TTeamMember> {
	const response = await api
		.patch(`teams/${teamId}/members/${userId}`, { json: payload })
		.json<TBaseResponse<TTeamMember>>();

	return response.data;
}

/**
 * Xóa một thành viên khỏi Team.
 */
export async function removeTeamMember(
	teamId: string,
	userId: string,
): Promise<boolean> {
	const response = await api
		.delete(`teams/${teamId}/members/${userId}`)
		.json<TBaseResponse<boolean>>();
	return response.data;
}

/**
 * Lấy số lượng các Project mà một thành viên đang tham gia trong Team.
 */
export async function getMemberProjectCount(
	teamId: string,
	userId: string,
): Promise<number> {
	const response = await api
		.get(`teams/${teamId}/members/${userId}/project-count`)
		.json<TBaseResponse<{ count: number }>>();
	return response.data.count;
}

export async function generateTeamInvite(
	teamId: string,
	payload: TTeamInviteGenerateRequest,
): Promise<TTeamInviteTokenResponse> {
	const response = await api
		.post(`teams/${teamId}/invitations/generate`, { json: payload })
		.json<TBaseResponse<TTeamInviteTokenResponse>>();
	return response.data;
}

export async function acceptTeamInvite(
	payload: TTeamInviteAcceptRequest,
): Promise<TTeamMember> {
	const response = await api
		.post(`teams/invitations/accept`, { json: payload })
		.json<TBaseResponse<TTeamMember>>();
	return response.data;
}
