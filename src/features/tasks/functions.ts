import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { isHTTPError } from "ky";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { CreateTaskSchema, FindTasksSchema, UpdateTaskSchema } from "./schemas";
import {
	completeTask,
	createTask,
	createTaskComment,
	deleteTask,
	estimateTask,
	fetchMyTasks,
	fetchMyTasksOverview,
	fetchTaskActivities,
	fetchTaskById,
	fetchTasks,
	startTask,
	updateTask,
} from "./server";

/**
 * Server Function lấy danh sách Task của Project
 */
export const fetchTasksFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string().optional(),
			params: FindTasksSchema,
		}),
	)
	.handler(async ({ data }) => fetchTasks(data.projectId, data.params));

/**
 * Server Function lấy tất cả task của current user (Dashboard Overview)
 */
export const fetchMyTasksFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ params: FindTasksSchema }))
	.handler(async ({ data }) => fetchMyTasks(data.params));

/**
 * Server Function lấy dashboard overview cá nhân, đã phân nhóm sẵn từ Backend.
 */
export const fetchMyTasksOverviewFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			teamId: z.string().optional(),
			clientToday: z.string().optional(),
		}),
	)
	.handler(async ({ data }) =>
		fetchMyTasksOverview(data.teamId, data.clientToday),
	);

/**
 * Server Function lấy chi tiết một Task
 */
export const fetchTaskByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			taskId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		try {
			return await fetchTaskById(data.projectId, data.taskId);
		} catch (error) {
			if (isHTTPError(error) && error.response.status === 404) {
				throw notFound();
			}
			throw error;
		}
	});

/**
 * Server Function tạo mới một Task
 */
export const createTaskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			payload: CreateTaskSchema,
		}),
	)
	.handler(async ({ data }) => createTask(data.projectId, data.payload));

/**
 * Server Function cập nhật một Task
 */
export const updateTaskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			taskId: z.string(),
			payload: UpdateTaskSchema,
		}),
	)
	.handler(async ({ data }) =>
		updateTask(data.projectId, data.taskId, data.payload),
	);

/**
 * Server Function xóa một Task
 */
export const deleteTaskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			taskId: z.string(),
		}),
	)
	.handler(async ({ data }) => deleteTask(data.projectId, data.taskId));

/**
 * Server Function ước lượng thời gian hoàn thành task bằng AI
 */
export const estimateTaskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			payload: z.object({
				title: z.string(),
				description: z.string().nullable(),
			}),
		}),
	)
	.handler(async ({ data }) => estimateTask(data.projectId, data.payload));

export const startTaskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ taskId: z.string() }))
	.handler(async ({ data }) => startTask(data.taskId));

export const completeTaskFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			taskId: z.string(),
			completedAt: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => completeTask(data.taskId, data.completedAt));

export const fetchTaskActivitiesFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ taskId: z.string() }))
	.handler(async ({ data }) => fetchTaskActivities(data.taskId));

export const createTaskCommentFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ taskId: z.string(), content: z.string() }))
	.handler(async ({ data }) => createTaskComment(data.taskId, data.content));
