import { createServerFn } from "@tanstack/react-start";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	ProjectByIdInputSchema,
	SubmitAnnotationAnswerInputSchema,
} from "./schemas";
import {
	getProjectById,
	listProjects,
	submitAnnotationAnswer,
} from "./server";

export const listProjectsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(() => listProjects());

export const getProjectByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(ProjectByIdInputSchema)
	.handler(({ data }) => getProjectById(data.projectId));

export const submitAnnotationAnswerFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(SubmitAnnotationAnswerInputSchema)
	.handler(({ data }) => submitAnnotationAnswer(data));
