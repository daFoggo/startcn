import { useSession } from "@tanstack/react-start/server";

type SessionData = {
	access_token?: string;
	refresh_token?: string;
	userId?: string;
};

/**
 * Hook (chỉ sử dụng ở phía Server) để quản lý phiên đăng nhập của người dùng.
 * Sử dụng thư viện `@tanstack/react-start` để quản lý session thông qua HTTP-only cookie,
 * giúp lưu trữ các thông tin xác thực (access_token, refresh_token) một cách an toàn
 * và tránh bị tấn công XSS.
 */
export function useAppSession() {
	return useSession<SessionData>({
		name: "anno_bot_session",
		password:
			process.env.SESSION_SECRET ||
			"default_development_secret_key_long_enough",
		cookie: {
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7, // Hết hạn sau 7 ngày
		},
	});
}
