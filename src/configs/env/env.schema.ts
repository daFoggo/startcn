/**
 * Environment Variables Schema
 * ============================
 * Define validation schemas for all environment variables.
 * Always add fields here when adding new environment variables.
 */

import { z } from "zod";

export const clientEnvSchema = z.object({
	VITE_BACKEND_URL: z.string().url({
		message: "VITE_BACKEND_URL must be a valid URL",
	}),
	VITE_BACKEND_API_URL: z.string().url({
		message: "VITE_BACKEND_API_URL must be a valid URL",
	}),
	VITE_CLERK_PUBLISHABLE_KEY: z
		.string()
		.min(1, "VITE_CLERK_PUBLISHABLE_KEY is required"),
});

export const serverEnvSchema = z.object({
	CLERK_SECRET_KEY: z
		.string()
		.min(1, "CLERK_SECRET_KEY is required")
		.startsWith("sk_", "CLERK_SECRET_KEY should start with sk_"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
