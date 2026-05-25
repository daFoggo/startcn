import { createMiddleware } from "@tanstack/react-start";

/**
 * Middleware ghi log cho các Server Functions trong môi trường phát triển (development).
 * Giúp theo dõi thời gian thực thi, trạng thái phản hồi và lỗi của các yêu cầu server-side,
 * đặc biệt hữu ích khi các network request trong TanStack Start thường bị mã hóa khó theo dõi.
 */
export const requestLoggerMiddleware = createMiddleware().server(
	async ({ request, next }) => {
		const startTime = Date.now();
		const url = new URL(request.url);

		if (process.env.NODE_ENV === "development") {
			console.log(`[SERVER-FN] 🚀 START: ${request.method} ${url.pathname}`);
		}

		try {
			const result = await next();
			const duration = Date.now() - startTime;

			const status = result?.response?.status ?? "OK";
			if (process.env.NODE_ENV === "development") {
				console.log(
					`[SERVER-FN] ✅ DONE: ${request.method} ${url.pathname} - Status: ${status} (${duration}ms)`,
				);
			}

			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			console.error(
				`[SERVER-FN] ❌ ERROR: ${url.pathname} after ${duration}ms:`,
				error,
			);
			throw error;
		}
	},
);

/**
 * Middleware tự động quản lý xác thực cho các Server Functions.
 * Nó thực hiện việc trích xuất access token từ phiên làm việc (session) và truyền vào context,
 * cho phép các hàm server-side truy cập token một cách đồng nhất mà không cần gọi lại session manually.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const { useAppSession } = await import("./session.server");
	const session = await useAppSession();
	const token = session.data.access_token;

	return next({
		context: {
			token,
		},
	});
});
