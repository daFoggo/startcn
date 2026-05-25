import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type {
	TAddProjectMemberInput,
	TProjectInviteAcceptRequest,
	TProjectInviteGenerateRequest,
	TProjectInviteTokenResponse,
	TProjectMember,
	TProjectMembersResponse,
	TUpdateProjectMemberRoleInput,
} from "./schemas";

/**
 * Lấy danh sách thành viên của một Project.
 */
export async function fetchProjectMembers(
	projectId: string,
): Promise<TProjectMembersResponse> {
	const response = await api
		.get(`projects/${projectId}/members`)
		.json<TBaseResponse<TProjectMembersResponse>>();

	return response.data;
}

/**
 * Thêm một thành viên mới vào Project.
 */
export async function addProjectMember(
	payload: TAddProjectMemberInput,
): Promise<TProjectMember> {
	const response = await api
		.post(`projects/${payload.projectId}/members`, { json: payload.payload })
		.json<TBaseResponse<TProjectMember>>();

	return response.data;
}

/**
 * Cập nhật vai trò (Role) của một thành viên trong Project.
 */
export async function updateProjectMemberRole(
	payload: TUpdateProjectMemberRoleInput,
): Promise<TProjectMember> {
	const response = await api
		.patch(`projects/${payload.projectId}/members/${payload.user_id}`, {
			json: payload.payload,
		})
		.json<TBaseResponse<TProjectMember>>();

	return response.data;
}

/**
 * Xóa một thành viên khỏi Project.
 */
export async function removeProjectMember(
	projectId: string,
	userId: string,
): Promise<boolean> {
	const response = await api
		.delete(`projects/${projectId}/members/${userId}`)
		.json<TBaseResponse<boolean>>();

	return response.data;
}

export async function generateProjectInvite(
	projectId: string,
	payload: TProjectInviteGenerateRequest,
): Promise<TProjectInviteTokenResponse> {
	const response = await api
		.post(`projects/${projectId}/invitations/generate`, { json: payload })
		.json<TBaseResponse<TProjectInviteTokenResponse>>();
	return response.data;
}

export async function acceptProjectInvite(
	payload: TProjectInviteAcceptRequest,
): Promise<TProjectMember> {
	const response = await api
		.post(`projects/invitations/accept`, { json: payload })
		.json<TBaseResponse<TProjectMember>>();
	return response.data;
}
