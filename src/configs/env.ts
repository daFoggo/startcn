import { z } from "zod";

/**
 * Cấu hình tập trung các API endpoints cho toàn bộ ứng dụng.
 * Bao gồm Base URL để truy cập static files và URL prefix cho các API requests.
 */
export const API_ENDPOINTS = {
	CORE_BASE_URL: import.meta.env.VITE_API_CORE_URL,
	AI_BASE_URL: import.meta.env.VITE_API_AI_URL,

	CORE_API_URL: `${import.meta.env.VITE_API_CORE_URL}/api/v1`,
	AI_API_URL: `${import.meta.env.VITE_API_AI_URL}/api/v1`,
} as const;

/**
 * Quản lý và validate các environment variables phía Client-side.
 * Đảm bảo các biến như API URL và App Name luôn hợp lệ khi ứng dụng khởi chạy.
 */
const clientEnvSchema = z.object({
	VITE_API_CORE_URL: z.string().url(),
	VITE_API_AI_URL: z.string().url(),
	VITE_APP_NAME: z.string().default("anno_bot"),
	VITE_TELEGRAM_BOT_USERNAME: z.string().optional(),
	VITE_TELEGRAM_LOGIN_CLIENT_ID: z.coerce.number().optional(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
export type TApiEndpoints = typeof API_ENDPOINTS;
