import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	TaskTagCreateSchema,
	TaskTagFindSchema,
	TaskTagUpdateSchema,
} from "../schemas";
import {
	createTaskTag,
	deleteTaskTag,
	fetchTaskTagById,
	fetchTaskTags,
	updateTaskTag,
} from "../servers";
import { withProjectId } from "./base";

export const getTaskTagsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			params: TaskTagFindSchema,
		}),
	)
	.handler(async ({ data }) => fetchTaskTags(data.projectId, data.params));

export const getTaskTagByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			tagId: z.string(),
		}),
	)
	.handler(async ({ data }) => fetchTaskTagById(data.projectId, data.tagId));

export const createTaskTagFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(withProjectId(TaskTagCreateSchema))
	.handler(async ({ data }) => createTaskTag(data.projectId, data.payload));

export const updateTaskTagFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			tagId: z.string(),
			payload: TaskTagUpdateSchema,
		}),
	)
	.handler(async ({ data }) =>
		updateTaskTag(data.projectId, data.tagId, data.payload),
	);

export const deleteTaskTagFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			tagId: z.string(),
		}),
	)
	.handler(async ({ data }) => deleteTaskTag(data.projectId, data.tagId));
