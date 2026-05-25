import { z } from "zod";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import type { TProjectMember } from "../project-members";
import type { TTask } from "../tasks";

export const ProjectStatsSchema = z.object({
	total_tasks: z.number(),
	completed_tasks: z.number(),
	weekly_activity: z.array(z.number()),
});
export type TProjectStats = z.infer<typeof ProjectStatsSchema>;

export const ProjectSchema = z.object({
	id: z.string(),
	team_id: z.string(),
	name: z
		.string()
		.min(3, "Project name must be at least 3 characters")
		.max(255),
	description: z.string().max(512).optional().nullable(),
	avatar_url: z.string().url().optional().nullable(),
	timezone: z.string().optional().nullable(),
	is_deleted: z.boolean().default(false),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime().optional().nullable(),
	stats: ProjectStatsSchema.optional().nullable(),
});

export const CreateProjectSchema = z.object({
	team_id: z.string(),
	name: z
		.string()
		.min(3, "Project name must be at least 3 characters")
		.max(255),
	description: z.string().max(512).optional(),
	avatar_url: z.string().url().optional(),
	timezone: z.string().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.omit({
	team_id: true,
}).partial();

export const GetProjectsSchema = z
	.object({
		team_id__eq: z.string().optional(),
		name__ilike: z.string().optional(),
		id__eq: z.string().optional(),
		is_deleted__eq: z.boolean().optional(),
		page: z.number().optional(),
		page_size: z.number().optional(),
		ordering: z.string().optional(),
	})
	.optional();

export const GetProjectSchema = z.object({
	projectId: z.string(),
});

export type TProjectSearchOptions = TBaseSearchOptions<number, string>;

export type TProjectsResponse = TBaseFindResponse<
	TProject,
	TProjectSearchOptions
>;

export type TProject = z.infer<typeof ProjectSchema> & {
	members?: TProjectMember[];
	tasks?: TTask[];
};

export type TGetProjectInput = z.infer<typeof GetProjectSchema>;
export type TGetProjectsInput = z.infer<typeof GetProjectsSchema>;
export type TCreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type TUpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// ── Dashboard: Task Stats ──────────────────────────────────────────────────────

export const TaskStatItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string(),
	count: z.number(),
});
export type TTaskStatItem = z.infer<typeof TaskStatItemSchema>;

export const StatsPeriodSchema = z.enum(["weekly", "monthly"]);
export type TStatsPeriod = z.infer<typeof StatsPeriodSchema>;

export const ProjectTaskStatsSchema = z.object({
	by_priority: z.array(TaskStatItemSchema),
	by_status: z.array(TaskStatItemSchema),
	by_type: z.array(TaskStatItemSchema),
	period: StatsPeriodSchema,
	date_from: z.string(),
	date_to: z.string(),
});
export type TProjectTaskStats = z.infer<typeof ProjectTaskStatsSchema>;

// ── Dashboard: Member Workload ─────────────────────────────────────────────────

export const WorkloadDataPointSchema = z.object({
	date: z.string(), // "YYYY-MM-DD"
	task_count: z.number(),
});

export const MemberWorkloadSchema = z.object({
	user_id: z.string(),
	name: z.string(),
	avatar_url: z.string().nullable().optional(),
	series: z.array(WorkloadDataPointSchema),
});
export type TMemberWorkload = z.infer<typeof MemberWorkloadSchema>;

export const ProjectWorkloadResponseSchema = z.object({
	members: z.array(MemberWorkloadSchema),
	period: StatsPeriodSchema,
	date_from: z.string(),
	date_to: z.string(),
});
export type TProjectWorkloadResponse = z.infer<
	typeof ProjectWorkloadResponseSchema
>;

// ── Dashboard: Recent Status Updates ───────────────────────────────────────────

export const TaskActivitySchema = z.object({
	id: z.string(),
	task_id: z.string(),
	task_title: z.string(),
	user_id: z.string(),
	user_name: z.string(),
	field_changed: z.string(),
	old_value: z.string().nullable().optional(),
	new_value: z.string().nullable().optional(),
	old_status_name: z.string().nullable().optional(),
	old_status_color: z.string().nullable().optional(),
	new_status_name: z.string().nullable().optional(),
	new_status_color: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type TTaskActivity = z.infer<typeof TaskActivitySchema>;
