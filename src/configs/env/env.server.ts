/**
 * Server Environment Configuration
 * =================================
 * Contains sensitive variables: Database URLs, API secrets, etc.
 * Only accessible in server functions (createServerFn) and API routes.
 */
import z from "zod";
import { type ServerEnv, serverEnvSchema } from "./env.schema";

const validateServerEnv = (): ServerEnv => {
	const parsed = serverEnvSchema.safeParse(process.env);

	if (!parsed.success) {
		console.error("Invalid server env ronment variables:");
		const formattedErros = z.treeifyError(parsed.error);

		console.error(formattedErros);
		throw new Error(`Invalid server environment variables:\n${formattedErros}`);
	}

	console.log("Server environment variables validated");
	return parsed.data;
};

const env = validateServerEnv();

export const SERVER_ENV_CONFIG = {
	clerkSecretKey: env.CLERK_SECRET_KEY,
	nodeEnv: env.NODE_ENV,

	isDev: env.NODE_ENV === "development",
	isProd: env.NODE_ENV === "production",
	isTest: env.NODE_ENV === "test",
} as const;

export type ServerEnvConfig = typeof SERVER_ENV_CONFIG;
