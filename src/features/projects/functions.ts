import { createServerFn } from "@tanstack/react-start";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { ProjectByIdInputSchema } from "./schemas";
import { getProjectById, listProjects } from "./server";

export const listProjectsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(() => listProjects());

export const getProjectByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(ProjectByIdInputSchema)
	.handler(({ data }) => getProjectById(data.projectId));
