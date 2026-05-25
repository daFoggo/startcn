import { createServerFn } from "@tanstack/react-start";

const getServerToken = createServerFn({ method: "GET" }).handler(async () => {
	const { useAppSession } = await import("./session.server");
	const session = await useAppSession();
	return session.data.access_token;
});

const clearServerSession = createServerFn({ method: "POST" }).handler(
	async () => {
		const { useAppSession } = await import("./session.server");
		const session = await useAppSession();
		await session.clear();
	},
);

/**
 * Lấy token để sử dụng cho các yêu cầu API trong src/lib/ky.ts.
 * Hàm này tự động kiểm tra nếu token sắp hết hạn (dựa trên ACCESS_REFRESH_SKEW_MS)
 * và thực hiện làm mới (refresh) token trước khi trả về để đảm bảo request không bị gián đoạn.
 */
export async function getAuthTokenForRequest() {
	if (typeof window !== "undefined" && isAccessTokenNearExpiry()) {
		if (!isRefreshTokenStillValid()) {
			await deleteAuthToken();
			return null;
		}

		const refreshedToken = await refreshAuthToken({ clearOnFailure: false });
		if (refreshedToken) {
			return refreshedToken;
		}
	}

	return getAuthToken();
}

/**
 * Lấy access token hiện tại từ bộ nhớ đệm (cache) hoặc server session.
 * Thường được sử dụng trong các route loader (ví dụ: src/routes/dashboard/route.tsx)
 * để kiểm tra nhanh trạng thái đăng nhập của người dùng mà không nhất thiết phải làm mới token.
 */
export async function getAuthToken() {
	const cachedToken = getCachedToken();
	if (cachedToken !== null) {
		return cachedToken;
	}

	try {
		const token = await getServerToken();
		setCachedToken(token ?? null);
		return token ?? null;
	} catch (_error) {
		return null;
	}
}

/**
 * Thực hiện quy trình làm mới token bằng cách gọi API refresh session.
 * Cập nhật token mới vào cache và localStorage, đồng thời quản lý việc gọi trùng lặp (deduplication)
 * thông qua refreshPromise. Được sử dụng tự động trong getAuthTokenForRequest hoặc xử lý lỗi 401.
 */
export async function refreshAuthToken(options?: { clearOnFailure?: boolean }) {
	const clearOnFailure = options?.clearOnFailure ?? true;

	if (refreshPromise) {
		return refreshPromise;
	}

	refreshPromise = (async () => {
		try {
			const { refreshSessionFn } = await import("@/features/auth");
			const response = await refreshSessionFn();
			setCachedToken(response.access_token);

			if (typeof window !== "undefined") {
				localStorage.setItem("expiration", response.expiration);
				localStorage.setItem("refresh_expiration", response.refresh_expiration);
			}

			return response.access_token;
		} catch (_error) {
			if (clearOnFailure) {
				await deleteAuthToken();
			}
			return null;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

/**
 * Xóa toàn bộ thông tin xác thực (token, thời gian hết hạn) khỏi localStorage,
 * xóa bộ nhớ đệm và hủy phiên làm việc trên server.
 * Được gọi khi người dùng thực hiện đăng xuất (logout) hoặc khi phát hiện session đã hết hạn hoàn toàn.
 */
export async function deleteAuthToken() {
	setCachedToken(null);

	if (typeof window !== "undefined") {
		localStorage.removeItem("expiration");
		localStorage.removeItem("refresh_expiration");
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
	}

	try {
		await clearServerSession();
	} catch (error) {
		console.error("Failed to clear session on server", error);
	}
}

// --- Internal Helpers & Server Functions ---

let tokenCache: { value: string | null; updatedAt: number } = {
	value: null,
	updatedAt: 0,
};
let refreshPromise: Promise<string | null> | null = null;

const TOKEN_CACHE_TTL_MS = 5000;
const ACCESS_REFRESH_SKEW_MS = 2 * 60 * 1000;

function getCachedToken() {
	if (typeof window === "undefined") return null;
	if (Date.now() - tokenCache.updatedAt > TOKEN_CACHE_TTL_MS) return null;
	return tokenCache.value;
}

function setCachedToken(token: string | null) {
	tokenCache = {
		value: token,
		updatedAt: Date.now(),
	};
}

function parseExpirationMs(rawValue: string | null): number | null {
	if (!rawValue) return null;

	const parsed = Date.parse(rawValue);
	if (!Number.isNaN(parsed)) {
		return parsed;
	}

	const maybeUnixSeconds = Number(rawValue);
	if (Number.isNaN(maybeUnixSeconds)) {
		return null;
	}

	return maybeUnixSeconds > 1e12 ? maybeUnixSeconds : maybeUnixSeconds * 1000;
}

function isAccessTokenNearExpiry() {
	if (typeof window === "undefined") return false;

	const expirationMs = parseExpirationMs(localStorage.getItem("expiration"));
	if (!expirationMs) return false;

	return expirationMs - Date.now() <= ACCESS_REFRESH_SKEW_MS;
}

function isRefreshTokenStillValid() {
	if (typeof window === "undefined") return true;

	const refreshExpirationMs = parseExpirationMs(
		localStorage.getItem("refresh_expiration"),
	);
	if (!refreshExpirationMs) return true;

	return refreshExpirationMs > Date.now();
}
