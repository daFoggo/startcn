import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { z } from "zod";
import type {
	SearchUsersInputSchema,
	TStatsPeriod,
	TUser,
	TUserProfileUpdate,
	TUserSearchResult,
	TUserStats,
} from "./schemas";

/**
 * Lấy thông tin tài khoản của người dùng hiện tại đang đăng nhập.
 */
export async function getUserMe(): Promise<TUser> {
	const response = await api.get("users/me").json<TBaseResponse<TUser>>();
	return response.data;
}

export async function updateUserProfile(
	params: TUserProfileUpdate,
): Promise<TUser> {
	const response = await api
		.patch("users/me/profile", { json: params })
		.json<TBaseResponse<TUser>>();
	return response.data;
}

/**
 * Lấy thống kê cá nhân (tasks completed, collaborated with) theo period.
 */
export async function fetchUserStats(
	period: TStatsPeriod = "weekly",
): Promise<TUserStats> {
	const response = await api
		.get("users/me/stats", { searchParams: { period } })
		.json<TBaseResponse<TUserStats>>();
	return response.data;
}

/**
 * Tìm kiếm người dùng theo tên hoặc email.
 * Hỗ trợ các bộ lọc loại trừ theo Team hoặc Project (Exclusion filters) để phục vụ việc mời thành viên.
 */
export async function searchUsers(
	params: z.infer<typeof SearchUsersInputSchema>,
): Promise<TUserSearchResult[]> {
	const searchParams: Record<string, string | number> = {
		q: params.q,
	};

	if (params.limit) {
		searchParams.limit = params.limit;
	}

	if (params.teamId) {
		searchParams.team_id = params.teamId;
	}

	if (params.excludeTeamId) {
		searchParams.exclude_team_id = params.excludeTeamId;
	}

	if (params.excludeProjectId) {
		searchParams.exclude_project_id = params.excludeProjectId;
	}

	const response = await api
		.get("users/search", { searchParams })
		.json<TBaseResponse<TUserSearchResult[]>>();

	return response.data;
}
