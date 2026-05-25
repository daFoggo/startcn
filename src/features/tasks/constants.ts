import type { TTask } from "./schemas";

/**
 * Catalog mặc định cho loại Task (áp dụng khi chưa load được config từ server)
 */
export const TASK_TYPE_CATALOG = [
	{
		value: "task",
		label: "Task",
		color: "#6c8ebf",
		icon: "lucide:list-checks",
		isDefault: true,
	},
	{
		value: "feature",
		label: "Feature",
		color: "#3BA6F1",
		icon: "lucide:sparkles",
		isDefault: false,
	},
	{
		value: "bug",
		label: "Bug",
		color: "#fb7185",
		icon: "lucide:bug",
		isDefault: false,
	},
	{
		value: "epic",
		label: "Epic",
		color: "#a78bfa",
		icon: "lucide:layers-3",
		isDefault: false,
	},
	{
		value: "sub-task",
		label: "Sub-task",
		color: "#97D6AE",
		icon: "lucide:subtitles",
		isDefault: false,
	},
] as const;

export type TTaskTypeOption = (typeof TASK_TYPE_CATALOG)[number];
export type TTaskType = TTaskTypeOption["value"];

/**
 * Catalog mặc định cho trạng thái Task
 */
export const TASK_STATUS_CATALOG = [
	{
		value: "backlog",
		label: "Backlog",
		color: "#8da4c0",
		isDefault: false,
		isCompleted: false,
		order: 1,
	},
	{
		value: "todo",
		label: "To Do",
		color: "#6c8ebf",
		isDefault: true,
		isCompleted: false,
		order: 2,
	},
	{
		value: "in-progress",
		label: "In Progress",
		color: "#3BA6F1",
		isDefault: false,
		isCompleted: false,
		order: 3,
	},
	{
		value: "in-review",
		label: "In Review",
		color: "#fdba74",
		isDefault: false,
		isCompleted: false,
		order: 4,
	},
	{
		value: "blocked",
		label: "Blocked",
		color: "#fb7185",
		isDefault: false,
		isCompleted: false,
		order: 5,
	},
	{
		value: "done",
		label: "Done",
		color: "#97D6AE",
		isDefault: false,
		isCompleted: true,
		order: 6,
	},
] as const;

export type TTaskStatusOption = (typeof TASK_STATUS_CATALOG)[number];
export type TTaskStatus = TTaskStatusOption["value"];

/**
 * Catalog mặc định cho độ ưu tiên Task
 */
export const TASK_PRIORITY_CATALOG = [
	{
		value: "lowest",
		label: "Lowest",
		color: "#8da4c0",
		level: 1,
		isDefault: false,
	},
	{
		value: "low",
		label: "Low",
		color: "#97D6AE",
		level: 2,
		isDefault: false,
	},
	{
		value: "medium",
		label: "Medium",
		color: "#3BA6F1",
		level: 3,
		isDefault: true,
	},
	{
		value: "high",
		label: "High",
		color: "#fdba74",
		level: 4,
		isDefault: false,
	},
	{
		value: "highest",
		label: "Highest",
		color: "#fb7185",
		level: 5,
		isDefault: false,
	},
] as const;

export type TTaskPriorityOption = (typeof TASK_PRIORITY_CATALOG)[number];
export type TTaskPriority = TTaskPriorityOption["value"];

/**
 * Các hằng số về API Route liên quan đến Task
 */
export const PROJECT_TASKS_ROUTE = "projects/{project_id}/tasks";
export const PROJECT_TASK_CONFIG_ROUTE = "projects/{project_id}/task-config";

/**
 * Các giá trị mặc định cho phân trang và sắp xếp
 */
export const DEFAULT_TASK_PAGE_SIZE = 20;
export const DEFAULT_TASK_ORDERING = "-id";

/**
 * Dữ liệu mock cho các tính năng Overview/Dashboard
 */
export const MOCK_TASKS: Partial<TTask>[] = [
	{
		id: "1",
		title: "Implement Bento Grid layout for Overview page",
		project_id: "agentick-fe",
		status_id: "in_progress",
		type_id: "feature",
		due_date: "2026-05-10T00:00:00Z",
		status: "In Progress",
		type: "Feature",
	},
	{
		id: "2",
		title: "Fix responsive issues on mobile sidebar",
		project_id: "agentick-fe",
		status_id: "in_progress",
		type_id: "bug",
		due_date: "2026-05-06T00:00:00Z",
		status: "In Progress",
		type: "Bug",
	},
	{
		id: "3",
		title: "Write unit tests for Auth service",
		project_id: "agentick-be",
		status_id: "todo",
		type_id: "task",
		due_date: "2026-05-15T00:00:00Z",
		status: "Upcoming",
		type: "Task",
	},
	{
		id: "4",
		title: "Database migration for notification system",
		project_id: "agentick-be",
		status_id: "overdue",
		type_id: "devops",
		due_date: "2026-05-01T00:00:00Z",
		status: "Overdue",
		type: "DevOps",
	},
	{
		id: "5",
		title: "Research Label Studio integration",
		project_id: "agentick-fe",
		status_id: "todo",
		type_id: "research",
		due_date: "2026-05-20T00:00:00Z",
		status: "Upcoming",
		type: "Research",
	},
];
