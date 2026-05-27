import { createServerFn } from "@tanstack/react-start";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { startTelegramLink } from "./server";

export const startTelegramLinkFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.handler(() => startTelegramLink());
