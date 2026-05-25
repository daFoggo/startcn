import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type {
	TRefreshTokenInput,
	TSignInInput,
	TSignInResponse,
	TSignUpInput,
	TSignUpResponse,
	TTokenResponse,
} from "./schemas";

/**
 * Gọi API thực hiện đăng nhập vào hệ thống.
 */
export async function signIn(params: TSignInInput): Promise<TSignInResponse> {
	const response = await api
		.post("auth/sign-in", { json: params })
		.json<TBaseResponse<TSignInResponse>>();
	return response.data;
}

/**
 * Gọi API thực hiện đăng ký tài khoản mới.
 */
export async function signUp(params: TSignUpInput): Promise<TSignUpResponse> {
	const response = await api
		.post("auth/sign-up", { json: params })
		.json<TBaseResponse<TSignUpResponse>>();
	return response.data;
}

/**
 * Gọi API để làm mới Access Token bằng Refresh Token.
 */
export async function refreshToken(
	params: TRefreshTokenInput,
): Promise<TTokenResponse> {
	const response = await api
		.post("auth/refresh", { json: params })
		.json<TBaseResponse<TTokenResponse>>();
	return response.data;
}
