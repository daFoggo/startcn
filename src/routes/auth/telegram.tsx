import {
	IconLoader2 as Loader2,
	IconBrandTelegram as Send,
	IconAlertTriangle as TriangleAlert,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthMutations } from "@/features/auth";
import type { TSignInResponse } from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/error";

const telegramSearchSchema = z.object({
	code: z.string().optional(),
	state: z.string().optional(),
	error: z.string().optional(),
	error_description: z.string().optional(),
	id: z.string().optional(),
	auth_date: z.string().optional(),
	hash: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	username: z.string().optional(),
	photo_url: z.string().optional(),
	phone_number: z.string().optional(),
	redirect: z.string().optional(),
});

const telegramCallbackPromises = new Map<
	string,
	Promise<{ response: TSignInResponse; redirect?: string }>
>();

export const Route = createFileRoute("/auth/telegram")({
	validateSearch: telegramSearchSchema,
	component: TelegramAuthCallbackPage,
});

function TelegramAuthCallbackPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { signInWithTelegram } = useAuthMutations();
	const [callbackError, setCallbackError] = useState<string | null>(null);
	const settledCallbackRef = useRef<string | null>(null);

	useEffect(() => {
		const hasCodePayload = Boolean(search.code && search.state);
		const hasLegacyPayload = Boolean(
			search.id && search.auth_date && search.hash,
		);
		if (search.error || (!hasCodePayload && !hasLegacyPayload)) return;

		const callbackKey = search.code
			? `${search.code}:${search.state}`
			: `${search.id}:${search.auth_date}:${search.hash}`;
		if (settledCallbackRef.current === callbackKey) return;

		let cancelled = false;

		async function exchangeCallback() {
			let redirect = search.redirect;

			if (hasCodePayload) {
				const loginState = readTelegramLoginState();
				redirect = loginState?.redirect || redirect;

				if (
					!loginState ||
					loginState.state !== search.state ||
					isExpiredLoginState(loginState.createdAt)
				) {
					throw new Error("Invalid Telegram login state. Please try again.");
				}

				const response = await signInWithTelegram.mutateAsync({
					code: search.code,
					redirect_uri: `${window.location.origin}/auth/telegram`,
					code_verifier: loginState.codeVerifier,
				});

				clearTelegramLoginState();
				return { response, redirect };
			}

			if (!search.id || !search.auth_date || !search.hash) {
				throw new Error("Missing Telegram login payload. Please try again.");
			}

			const response = await signInWithTelegram.mutateAsync({
				id: search.id,
				auth_date: search.auth_date,
				hash: search.hash,
				first_name: search.first_name,
				last_name: search.last_name,
				username: search.username,
				photo_url: search.photo_url,
				phone_number: search.phone_number,
			});
			return { response, redirect };
		}

		const existingCallback = telegramCallbackPromises.get(callbackKey);
		const callbackPromise = existingCallback || exchangeCallback();
		if (!existingCallback) {
			telegramCallbackPromises.set(callbackKey, callbackPromise);
			callbackPromise.then(
				() => {
					telegramCallbackPromises.delete(callbackKey);
				},
				() => {
					telegramCallbackPromises.delete(callbackKey);
				},
			);
		}

		callbackPromise
			.then(({ response, redirect }) => {
				if (cancelled) return;

				settledCallbackRef.current = callbackKey;
				localStorage.setItem("expiration", response.expiration);
				localStorage.setItem("refresh_expiration", response.refresh_expiration);
				toast.success("Signed in with Telegram");
				navigate({
					to: response.user_info.profile_completed
						? redirect || "/dashboard"
						: "/dashboard/projects",
				});
			})
			.catch((error) => {
				if (cancelled) return;

				settledCallbackRef.current = callbackKey;
				const message = getErrorMessage(
					error,
					"Telegram sign in failed. Please try again.",
				);
				setCallbackError(message);
				toast.error(message);
			});

		return () => {
			cancelled = true;
		};
	}, [navigate, search, signInWithTelegram]);

	const hasPayload = Boolean(
		(search.code && search.state) ||
			(search.id && search.auth_date && search.hash),
	);
	const errorMessage =
		callbackError ||
		search.error_description ||
		search.error ||
		"Telegram sign in was cancelled.";

	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-6">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						<Send className="size-5 shrink-0" />
						Telegram sign in
					</CardTitle>
				</CardHeader>
				<CardContent>
					{search.error || callbackError ? (
						<Alert variant="destructive">
							<TriangleAlert />
							<AlertTitle>Telegram sign in failed</AlertTitle>
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					) : hasPayload ? (
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<Loader2 className="size-4 shrink-0 animate-spin" />
							<span>Verifying Telegram account...</span>
						</div>
					) : (
						<Alert variant="destructive">
							<TriangleAlert />
							<AlertTitle>Missing Telegram payload</AlertTitle>
							<AlertDescription>
								Open this page from a Telegram login button or login URL.
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		</main>
	);
}

interface ITelegramLoginState {
	state: string;
	codeVerifier: string;
	redirect?: string;
	createdAt?: number;
}

function readTelegramLoginState(): ITelegramLoginState | null {
	const raw =
		sessionStorage.getItem("telegram_oidc_login") ||
		localStorage.getItem("telegram_oidc_login");
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as Partial<ITelegramLoginState>;
		if (!parsed.state || !parsed.codeVerifier) return null;
		return {
			state: parsed.state,
			codeVerifier: parsed.codeVerifier,
			redirect:
				parsed.redirect ||
				sessionStorage.getItem("telegram_oidc_redirect") ||
				localStorage.getItem("telegram_oidc_redirect") ||
				undefined,
			createdAt: parsed.createdAt,
		};
	} catch {
		return null;
	}
}

function clearTelegramLoginState() {
	sessionStorage.removeItem("telegram_oidc_login");
	sessionStorage.removeItem("telegram_oidc_redirect");
	localStorage.removeItem("telegram_oidc_login");
	localStorage.removeItem("telegram_oidc_redirect");
}

function isExpiredLoginState(createdAt?: number) {
	if (!createdAt) return true;
	const maxAgeMs = 10 * 60 * 1000;
	return Date.now() - createdAt > maxAgeMs;
}
