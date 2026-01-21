import { createMiddleware } from "@tanstack/react-start";

export const requestLogger = createMiddleware().server(
	async ({ request, next }) => {
		const startTime = Date.now();
		const timestamp = new Date().toISOString();

		console.log(`[${timestamp}] ${request.method} ${request.url} - Starting`);

		try {
			const result = await next();
			const duration = Date.now() - startTime;

			console.log(
				`[${timestamp}] ${request.method} ${request.url} - ${result.response.status} (${duration}ms)`,
			);

			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			console.error(
				`[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
				error,
			);
			throw error;
		}
	},
);
