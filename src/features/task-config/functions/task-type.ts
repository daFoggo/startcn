import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	TaskTypeCreateSchema,
	TaskTypeFindSchema,
	TaskTypeUpdateSchema,
} from "../schemas";
import {
	createTaskType,
	deleteTaskType,
	fetchTaskTypeById,
	fetchTaskTypes,
	updateTaskType,
} from "../servers/task-type";
import { withProjectId } from "./base";

export const getTaskTypesFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			params: TaskTypeFindSchema,
		}),
	)
	.handler(async ({ data }) => fetchTaskTypes(data.projectId, data.params));

export const getTaskTypeByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			typeId: z.string(),
		}),
	)
	.handler(async ({ data }) => fetchTaskTypeById(data.projectId, data.typeId));

export const createTaskTypeFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(withProjectId(TaskTypeCreateSchema))
	.handler(async ({ data }) => createTaskType(data.projectId, data.payload));

export const updateTaskTypeFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			typeId: z.string(),
			payload: TaskTypeUpdateSchema,
		}),
	)
	.handler(async ({ data }) =>
		updateTaskType(data.projectId, data.typeId, data.payload),
	);

export const deleteTaskTypeFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			typeId: z.string(),
		}),
	)
	.handler(async ({ data }) => deleteTaskType(data.projectId, data.typeId));
