import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	TaskStatusCreateSchema,
	TaskStatusFindSchema,
	TaskStatusUpdateSchema,
} from "../schemas";
import {
	createTaskStatus,
	deleteTaskStatus,
	fetchTaskStatusById,
	fetchTaskStatuses,
	updateTaskStatus,
} from "../servers/task-status";
import { withProjectId } from "./base";

export const getTaskStatusesFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			params: TaskStatusFindSchema,
		}),
	)
	.handler(async ({ data }) => fetchTaskStatuses(data.projectId, data.params));

export const getTaskStatusByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			statusId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		fetchTaskStatusById(data.projectId, data.statusId),
	);

export const createTaskStatusFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(withProjectId(TaskStatusCreateSchema))
	.handler(async ({ data }) => createTaskStatus(data.projectId, data.payload));

export const updateTaskStatusFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			statusId: z.string(),
			payload: TaskStatusUpdateSchema,
		}),
	)
	.handler(async ({ data }) =>
		updateTaskStatus(data.projectId, data.statusId, data.payload),
	);

export const deleteTaskStatusFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			statusId: z.string(),
		}),
	)
	.handler(async ({ data }) => deleteTaskStatus(data.projectId, data.statusId));
