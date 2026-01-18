/**
 * Client Environment Configuration
 * =================================
 * Contains PUBLIC variables only - these are bundled into client code!
 * Never put secrets here - use VITE_ prefix for all variables.
 */
import z from "zod";
import { type ClientEnv, clientEnvSchema } from "./env.schema";

const validateClientEnv = (): ClientEnv => {
	const parsed = clientEnvSchema.safeParse(import.meta.env);

	if (!parsed.success) {
		console.error("Invalid client environment variables:");
		const formattedErrors = z.treeifyError(parsed.error);

		console.error(formattedErrors);
		throw new Error(
			`Invalid client environment variables:\n${formattedErrors}`,
		);
	}

	if (import.meta.env.DEV) {
		console.log("Client environment variables validated");
	}

	return parsed.data;
};

const env = validateClientEnv();

export const CLIENT_ENV_CONFIG = {
	backendUrl: env.VITE_BACKEND_URL,
	backendApiUrl: env.VITE_BACKEND_API_URL,
	clerkPublishableKey: env.VITE_CLERK_PUBLISHABLE_KEY,
	mode: import.meta.env.MODE,
	isDev: import.meta.env.DEV,
	isProd: import.meta.env.PROD,
	isSSR: import.meta.env.SSR,
} as const;

export type ClientEnvConfig = typeof CLIENT_ENV_CONFIG;
