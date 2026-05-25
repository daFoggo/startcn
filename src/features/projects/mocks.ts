import type { TTask } from "@/features/tasks";

export type TProjectDashboardTask = Partial<TTask> & {
	status_from?: string;
	status_to?: string;
};

export const MOCK_PROJECT_TASKS: TProjectDashboardTask[] = [
	{
		id: "1",
		title: "Implement Bento Grid layout for Overview page",
		project_id: "agentick-fe",
		status_id: "in_progress",
		type_id: "feature",
		priority_id: "medium",
		due_date: "2026-05-10T00:00:00Z",
		status: "In Progress",
		type: "Feature",
		status_from: "To Do",
		status_to: "In Progress",
	},
	{
		id: "2",
		title: "Fix responsive issues on mobile sidebar",
		project_id: "agentick-fe",
		status_id: "in_progress",
		type_id: "bug",
		priority_id: "high",
		due_date: "2026-05-06T00:00:00Z",
		status: "In Progress",
		type: "Bug",
		status_from: "In Progress",
		status_to: "In Review",
	},
	{
		id: "3",
		title: "Write unit tests for Auth service",
		project_id: "agentick-be",
		status_id: "todo",
		type_id: "task",
		priority_id: "low",
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
		priority_id: "highest",
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
		priority_id: "medium",
		due_date: "2026-05-20T00:00:00Z",
		status: "Upcoming",
		type: "Research",
	},
	{
		id: "6",
		title: "API rate limiting setup",
		project_id: "agentick-be",
		status_id: "in_progress",
		type_id: "feature",
		priority_id: "lowest",
		due_date: "2026-05-08T00:00:00Z",
		status: "In Progress",
		type: "Feature",
		status_from: "To Do",
		status_to: "In Progress",
	},
];

export default MOCK_PROJECT_TASKS;

export const MOCK_PROJECT_MEMBERS = [
	{ id: "u1", name: "Alice" },
	{ id: "u2", name: "Bob" },
	{ id: "u3", name: "Carmen" },
];

// Small-multiple time series per user for workload (week/month)
export const MOCK_USER_WORKLOAD = [
	{
		userId: "u1",
		name: "Alice",
		// week: Mon-Sun (May 5-11)
		week: [
			{ period: "2026-05-05", value: 1 },
			{ period: "2026-05-06", value: 2 },
			{ period: "2026-05-07", value: 3 },
			{ period: "2026-05-08", value: 1 },
			{ period: "2026-05-09", value: 0 },
			{ period: "2026-05-10", value: 2 },
			{ period: "2026-05-11", value: 1 },
		],
		// month: 12 days sample
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [1, 2, 2, 1, 3, 1, 0, 2, 1, 1, 2, 1][i] ?? 0,
		})),
	},
	{
		userId: "u2",
		name: "Bob",
		week: [
			{ period: "2026-05-05", value: 2 },
			{ period: "2026-05-06", value: 1 },
			{ period: "2026-05-07", value: 2 },
			{ period: "2026-05-08", value: 1 },
			{ period: "2026-05-09", value: 2 },
			{ period: "2026-05-10", value: 1 },
			{ period: "2026-05-11", value: 2 },
		],
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [0, 1, 1, 2, 1, 2, 1, 0, 2, 1, 1, 2][i] ?? 0,
		})),
	},
	{
		userId: "u3",
		name: "Carmen",
		week: [
			{ period: "2026-05-05", value: 2 },
			{ period: "2026-05-06", value: 1 },
			{ period: "2026-05-07", value: 4 },
			{ period: "2026-05-08", value: 2 },
			{ period: "2026-05-09", value: 1 },
			{ period: "2026-05-10", value: 3 },
			{ period: "2026-05-11", value: 1 },
		],
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [1, 0, 2, 1, 2, 2, 0, 2, 1, 2, 1, 1][i] ?? 0,
		})),
	},
	{
		userId: "u4",
		name: "David",
		week: [
			{ period: "2026-05-05", value: 0 },
			{ period: "2026-05-06", value: 1 },
			{ period: "2026-05-07", value: 1 },
			{ period: "2026-05-08", value: 2 },
			{ period: "2026-05-09", value: 2 },
			{ period: "2026-05-10", value: 1 },
			{ period: "2026-05-11", value: 3 },
		],
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [0, 1, 2, 1, 1, 2, 0, 1, 2, 2, 1, 3][i] ?? 0,
		})),
	},
	{
		userId: "u5",
		name: "Elena",
		week: [
			{ period: "2026-05-05", value: 3 },
			{ period: "2026-05-06", value: 2 },
			{ period: "2026-05-07", value: 1 },
			{ period: "2026-05-08", value: 0 },
			{ period: "2026-05-09", value: 1 },
			{ period: "2026-05-10", value: 2 },
			{ period: "2026-05-11", value: 2 },
		],
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [2, 1, 1, 0, 1, 2, 2, 1, 0, 2, 2, 1][i] ?? 0,
		})),
	},
	{
		userId: "u6",
		name: "Farah",
		week: [
			{ period: "2026-05-05", value: 1 },
			{ period: "2026-05-06", value: 1 },
			{ period: "2026-05-07", value: 2 },
			{ period: "2026-05-08", value: 3 },
			{ period: "2026-05-09", value: 1 },
			{ period: "2026-05-10", value: 0 },
			{ period: "2026-05-11", value: 2 },
		],
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [1, 0, 2, 1, 3, 2, 1, 1, 0, 2, 1, 2][i] ?? 0,
		})),
	},
	{
		userId: "u7",
		name: "George",
		week: [
			{ period: "2026-05-05", value: 2 },
			{ period: "2026-05-06", value: 3 },
			{ period: "2026-05-07", value: 1 },
			{ period: "2026-05-08", value: 1 },
			{ period: "2026-05-09", value: 2 },
			{ period: "2026-05-10", value: 2 },
			{ period: "2026-05-11", value: 1 },
		],
		month: Array.from({ length: 12 }).map((_, i) => ({
			period: `2026-05-${String(i + 1).padStart(2, "0")}`,
			value: [1, 2, 1, 2, 1, 3, 1, 2, 2, 1, 0, 2][i] ?? 0,
		})),
	},
];
