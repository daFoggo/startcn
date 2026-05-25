import "@tanstack/react-start/server-only";
import { z } from "zod";

/**
 * Quản lý các environment variables chỉ tồn tại ở phía Server-side.
 * Chứa các thông tin sensitive (như API Keys).
 * File này được đảm bảo không lọt xuống Client-side nhờ import "server-only".
 */
const serverEnvSchema = z.object({
	DATABASE_URL: z.string().url(),
	OPEN_AI_API_KEY: z.string().min(1),
	SELINE_TOKEN: z.string().min(1),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

export const serverEnv = serverEnvSchema.parse(process.env);
