import ky, { isHTTPError } from "ky";
import { API_ENDPOINTS } from "@/configs/env";

/**
 * Instance của thư viện `ky` được cấu hình sẵn cho các yêu cầu đến Backend Core.
 * Tự động xử lý:
 * - Gắn Bearer Token vào header mỗi khi gửi request.
 * - Tự động thử lại (retry) một lần khi gặp lỗi 401 bằng cách gọi API refresh token.
 * - Điều hướng về trang sign-in nếu xác thực thất bại hoàn toàn.
 */
export const api = ky.create({
	timeout: 30000,
	prefix: API_ENDPOINTS.CORE_API_URL,
	hooks: {
		beforeRequest: [
			async ({ request }) => {
				const { getAuthTokenForRequest } = await import("./auth-token");
				const token = await getAuthTokenForRequest();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
		afterResponse: [
			async ({ request, options, response }) => {
				if (response.status !== 401) {
					return response;
				}

				const alreadyRetried = request.headers.get(AUTH_RETRY_HEADER) === "1";
				const isOnAuthPage =
					typeof window !== "undefined" &&
					window.location.pathname.startsWith("/auth/");

				if (!alreadyRetried && !isOnAuthPage) {
					const { refreshAuthToken } = await import("./auth-token");
					const nextToken = await refreshAuthToken();

					if (nextToken) {
						const retryHeaders = new Headers(request.headers);
						retryHeaders.set("Authorization", `Bearer ${nextToken}`);
						retryHeaders.set(AUTH_RETRY_HEADER, "1");

						return ky(request, {
							...options,
							headers: retryHeaders,
						});
					}
				}

				const { deleteAuthToken } = await import("./auth-token");
				await deleteAuthToken();

				if (typeof window !== "undefined") {
					const { redirect } = await import("@tanstack/react-router");
					throw redirect({
						to: "/auth/sign-in",
						search: {
							redirect: window.location.href,
						},
					});
				}

				return response;
			},
		],
		beforeError: [
			({ error }) => {
				if (!isHTTPError(error)) {
					return error;
				}

				error.message = getBackendErrorMessage(error.data, error.message);
				return error;
			},
		],
	},
});

/**
 * Instance mở rộng từ `api`, được cấu hình riêng cho Backend AI.
 * Kế thừa toàn bộ logic xác thực, retry và prefix API cơ bản của dự án.
 */
export const aiApi = api.extend({
	prefix: API_ENDPOINTS.AI_API_URL,
});

// --- Internal Constants & Configuration ---

const AUTH_RETRY_HEADER = "x-auth-retry";

const BACKEND_ERROR_MESSAGE_KEYS = ["message", "detail", "error"] as const;

function getBackendErrorMessage(data: unknown, fallback: string) {
	if (typeof data === "string") {
		return data.trim() || fallback;
	}

	if (!isRecord(data)) {
		return fallback;
	}

	for (const key of BACKEND_ERROR_MESSAGE_KEYS) {
		const message = getReadableMessage(data[key]);
		if (message) {
			return message;
		}
	}

	const errors = getReadableMessage(data.errors);
	return errors || fallback;
}

function getReadableMessage(value: unknown): string | null {
	if (typeof value === "string") {
		return value.trim() || null;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			const message = getReadableMessage(item);
			if (message) {
				return message;
			}
		}
	}

	if (isRecord(value)) {
		for (const key of BACKEND_ERROR_MESSAGE_KEYS) {
			const message = getReadableMessage(value[key]);
			if (message) {
				return message;
			}
		}
	}

	return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
