import { Loader2, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/configs/env";

interface ITelegramLoginButtonProps {
	isPending?: boolean;
	redirect?: string;
	onError: (message: string) => void;
}

export const TelegramLoginButton = ({
	isPending,
	redirect,
	onError,
}: ITelegramLoginButtonProps) => {
	const clientId = clientEnv.VITE_TELEGRAM_LOGIN_CLIENT_ID;

	const handleLogin = async () => {
		if (!clientId) {
			onError("Telegram Login Client ID is not configured.");
			return;
		}

		const redirectUri = `${window.location.origin}/auth/telegram`;
		const state = crypto.randomUUID();
		const codeVerifier = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
		const codeChallenge = await createCodeChallenge(codeVerifier);

		const loginState = JSON.stringify({
			state,
			codeVerifier,
			redirect,
			createdAt: Date.now(),
		});

		sessionStorage.setItem("telegram_oidc_login", loginState);
		localStorage.setItem("telegram_oidc_login", loginState);
		if (redirect) {
			sessionStorage.setItem("telegram_oidc_redirect", redirect);
			localStorage.setItem("telegram_oidc_redirect", redirect);
		} else {
			sessionStorage.removeItem("telegram_oidc_redirect");
			localStorage.removeItem("telegram_oidc_redirect");
		}

		const authUrl = new URL("https://oauth.telegram.org/auth");
		authUrl.searchParams.set("client_id", String(clientId));
		authUrl.searchParams.set("redirect_uri", redirectUri);
		authUrl.searchParams.set("response_type", "code");
		authUrl.searchParams.set(
			"scope",
			"openid profile phone telegram:bot_access",
		);
		authUrl.searchParams.set("state", state);
		authUrl.searchParams.set("code_challenge", codeChallenge);
		authUrl.searchParams.set("code_challenge_method", "S256");

		window.location.href = authUrl.toString();
	};

	if (!clientId) {
		return (
			<Alert>
				<Send className="size-4" />
				<AlertDescription>
					Telegram OIDC login is not configured for this environment.
				</AlertDescription>
			</Alert>
		);
	}

	if (isPending) {
		return (
			<Button type="button" className="w-full" disabled>
				<span>Signing in with Telegram</span>
				<Loader2 className="size-4 animate-spin" />
			</Button>
		);
	}

	return (
		<Button type="button" className="w-full" onClick={handleLogin}>
			<Send className="size-4" />
			<span>Continue with Telegram</span>
		</Button>
	);
};

async function createCodeChallenge(codeVerifier: string) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array) {
	const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
