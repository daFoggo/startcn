import { createServerFn } from "@tanstack/react-start";
import { serverEnv } from "@/configs/env.server";

/**
 * Server Function mẫu minh họa cách truy cập an toàn vào các biến môi trường
 * chỉ tồn tại ở phía server (ví dụ: OPEN_AI_API_KEY).
 * Hàm này đảm bảo các thông tin nhạy cảm không bao giờ bị lộ ra client-side.
 */
export const getSecretData = createServerFn({ method: "GET" }).handler(
	async () => {
		const { OPEN_AI_API_KEY } = serverEnv;

		return {
			message: "This data was fetched using the migrated OpenAI secret.",
			status: OPEN_AI_API_KEY ? "Authenticated" : "No Secret Found",
		};
	},
);
