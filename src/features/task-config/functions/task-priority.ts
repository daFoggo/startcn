import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	TaskPriorityCreateSchema,
	TaskPriorityFindSchema,
	TaskPriorityUpdateSchema,
} from "../schemas";
import {
	createTaskPriority,
	deleteTaskPriority,
	fetchTaskPriorities,
	fetchTaskPriorityById,
	updateTaskPriority,
} from "../servers/task-priority";
import { withProjectId } from "./base";

export const getTaskPrioritiesFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			params: TaskPriorityFindSchema,
		}),
	)
	.handler(async ({ data }) =>
		fetchTaskPriorities(data.projectId, data.params),
	);

export const getTaskPriorityByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			priorityId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		fetchTaskPriorityById(data.projectId, data.priorityId),
	);

export const createTaskPriorityFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(withProjectId(TaskPriorityCreateSchema))
	.handler(async ({ data }) =>
		createTaskPriority(data.projectId, data.payload),
	);

export const updateTaskPriorityFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			priorityId: z.string(),
			payload: TaskPriorityUpdateSchema,
		}),
	)
	.handler(async ({ data }) =>
		updateTaskPriority(data.projectId, data.priorityId, data.payload),
	);

export const deleteTaskPriorityFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			priorityId: z.string(),
		}),
	)
	.handler(async ({ data }) =>
		deleteTaskPriority(data.projectId, data.priorityId),
	);
