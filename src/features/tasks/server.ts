import "@tanstack/react-start/server-only";
import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import {
	CreateTaskSchema,
	type TCreateTaskInput,
	type TFindTasksInput,
	type TMyTasksOverview,
	type TTask,
	type TTaskAIEstimationExplanation,
	type TTasksResponse,
	type TUpdateTaskInput,
	UpdateTaskSchema,
} from "./schemas";

/**
 * Xây dựng đường dẫn API cho Task. Nếu có projectId thì lấy theo project, ngược lại lấy global.
 */
const buildTaskPath = (projectId?: string) =>
	projectId ? `projects/${projectId}/tasks` : `tasks`;

/**
 * Lấy tất cả task được assign cho current user (dùng cho Dashboard Overview).
 * Không cần truyền projectId — API tự lấy theo token.
 */
export async function fetchMyTasks(
	params?: TFindTasksInput,
): Promise<TTasksResponse> {
	const response = await api
		.get("users/me/tasks", {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TTasksResponse>>();

	return response.data;
}

/**
 * Lấy Overview các Task được gán cho User hiện tại, phân loại sẵn từ Backend.
 */
export async function fetchMyTasksOverview(
	teamId?: string,
	clientToday?: string,
): Promise<TMyTasksOverview> {
	const response = await api
		.get("users/me/tasks/overview", {
			searchParams: {
				...(teamId ? { team_id: teamId } : {}),
				...(clientToday ? { client_today: clientToday } : {}),
			},
		})
		.json<TBaseResponse<TMyTasksOverview>>();

	return response.data;
}

/**
 * Lấy danh sách các Task (có hỗ trợ filter và pagination).
 */
export async function fetchTasks(
	projectId?: string,
	params?: TFindTasksInput,
): Promise<TTasksResponse> {
	const response = await api
		.get(buildTaskPath(projectId), {
			searchParams: params as
				| Record<string, string | number | boolean>
				| undefined,
		})
		.json<TBaseResponse<TTasksResponse>>();

	return response.data;
}

/**
 * Lấy thông tin chi tiết của một Task theo TaskId trong Project.
 */
export async function fetchTaskById(
	projectId: string,
	taskId: string,
): Promise<TTask> {
	const response = await api
		.get(`${buildTaskPath(projectId)}/${taskId}`)
		.json<TBaseResponse<TTask>>();
	return response.data;
}

/**
 * Tạo một Task mới trong Project.
 */
export async function createTask(
	projectId: string,
	payload: TCreateTaskInput,
): Promise<TTask> {
	const response = await api
		.post(`${buildTaskPath(projectId)}`, {
			json: CreateTaskSchema.parse({
				...payload,
				project_id: payload.project_id ?? projectId,
			}),
		})
		.json<TBaseResponse<TTask>>();

	return response.data;
}

/**
 * Cập nhật thông tin chi tiết của một Task.
 */
export async function updateTask(
	projectId: string,
	taskId: string,
	payload: TUpdateTaskInput,
): Promise<TTask> {
	const response = await api
		.patch(`${buildTaskPath(projectId)}/${taskId}`, {
			json: UpdateTaskSchema.parse(payload),
		})
		.json<TBaseResponse<TTask>>();

	return response.data;
}

/**
 * Thực hiện xóa một Task khỏi Project.
 */
export async function deleteTask(
	projectId: string,
	taskId: string,
): Promise<boolean> {
	const response = await api
		.delete(`${buildTaskPath(projectId)}/${taskId}`)
		.json<TBaseResponse<boolean>>();

	return response.data;
}

/**
 * Ước lượng thời gian hoàn thành của Task sử dụng AI.
 */
export async function estimateTask(
	projectId: string,
	payload: { title: string; description: string | null },
): Promise<TTaskAIEstimationExplanation> {
	const response = await api
		.post(`projects/${projectId}/tasks/estimate`, {
			json: payload,
		})
		.json<TBaseResponse<TTaskAIEstimationExplanation>>();

	return response.data;
}

/**
 * Start a task lifecycle
 */
export async function startTask(taskId: string): Promise<TTask> {
	const response = await api
		.post(`tasks/${taskId}/start`)
		.json<TBaseResponse<TTask>>();
	return response.data;
}

/**
 * Complete a task lifecycle
 */
export async function completeTask(
	taskId: string,
	completedAt?: string,
): Promise<TTask> {
	const response = await api
		.post(`tasks/${taskId}/complete`, {
			searchParams: completedAt ? { completed_at: completedAt } : {},
		})
		.json<TBaseResponse<TTask>>();
	return response.data;
}

/**
 * Fetch all activity logs for a specific task
 */
export async function fetchTaskActivities(taskId: string): Promise<any[]> {
	const response = await api
		.get(`tasks/${taskId}/activities`)
		.json<TBaseResponse<any[]>>();
	return response.data;
}

export async function createTaskComment(
	taskId: string,
	content: string,
): Promise<any> {
	const response = await api
		.post(`tasks/${taskId}/comments`, {
			json: { task_id: taskId, content, activity_type: "comment" },
		})
		.json<TBaseResponse<any>>();
	return response.data;
}
