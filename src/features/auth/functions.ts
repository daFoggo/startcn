import { createServerFn } from "@tanstack/react-start";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	SignInSchema,
	SignUpSchema,
	TelegramLoginPayloadSchema,
} from "./schemas";
import { refreshToken, signIn, signInWithTelegram, signUp } from "./server";

export const signInFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(SignInSchema)
	.handler(async ({ data }) => {
		const { useAppSession } = await import("@/lib/session.server");
		const response = await signIn(data);
		const session = await useAppSession();
		await session.update({
			access_token: response.access_token,
			refresh_token: response.refresh_token,
		});
		return response;
	});

export const signInWithTelegramFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(TelegramLoginPayloadSchema)
	.handler(async ({ data }) => {
		const { useAppSession } = await import("@/lib/session.server");
		const response = await signInWithTelegram(data);
		const session = await useAppSession();
		await session.update({
			access_token: response.access_token,
			refresh_token: response.refresh_token,
		});
		return response;
	});

export const signUpFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(SignUpSchema)
	.handler(async ({ data }) => {
		const { useAppSession } = await import("@/lib/session.server");
		const response = await signUp(data);
		const session = await useAppSession();
		await session.clear();
		return response;
	});

export const signOutFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const { useAppSession } = await import("@/lib/session.server");
		const session = await useAppSession();
		await session.clear();
	});

export const refreshSessionFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		const { useAppSession } = await import("@/lib/session.server");
		const session = await useAppSession();

		const currentRefreshToken = session.data.refresh_token;
		if (!currentRefreshToken) {
			throw new Error("Missing refresh token in session");
		}

		const response = await refreshToken({
			refresh_token: currentRefreshToken,
		});

		await session.update({
			access_token: response.access_token,
			refresh_token: response.refresh_token,
		});

		return response;
	});
