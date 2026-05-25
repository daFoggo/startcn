import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	analyzeProjectRisk,
	analyzeTaskRisk,
	fetchProjectRiskStats,
} from "./server";

export const analyzeTaskRiskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ taskId: z.string() }))
	.handler(async ({ data }) => analyzeTaskRisk(data.taskId));

export const fetchProjectRiskStatsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ projectId: z.string() }))
	.handler(async ({ data }) => fetchProjectRiskStats(data.projectId));

export const analyzeProjectRiskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ projectId: z.string() }))
	.handler(async ({ data }) => analyzeProjectRisk(data.projectId));
