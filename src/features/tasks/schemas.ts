import type { ReactFormApi } from "@tanstack/react-form";
import { z } from "zod";
import {
	ApiDateSchema,
	FindOrderingSchema,
	FindPageSchema,
	FindPageSizeWithAllSchema,
} from "@/lib/zod-common";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import type { TProjectMember } from "../project-members";
import type {
	TTaskPriority as TTaskPriorityOption,
	TTaskStatus as TTaskStatusOption,
	TTaskTag,
	TTaskType as TTaskTypeOption,
} from "../task-config";
import type { TUser } from "../users";

/**
 * Schema cho Thành viên của Task (Thay thế cho Assignee thuần túy)
 */
export const TaskMemberSchema = z.object({
	task_id: z.string(),
	user_id: z.string(),
	role: z.enum(["lead", "member"]),
	joined_at: ApiDateSchema,
	user: z.any().optional(), // Có thể fetch kèm user info
});

export type TTaskMember = z.infer<typeof TaskMemberSchema> & {
	user?: TUser;
};

export interface ITaskListDialogOptions {
	statuses: TTaskStatusOption[];
	types: TTaskTypeOption[];
	priorities: TTaskPriorityOption[];
	members: TProjectMember[];
}

/**
 * Schema chính cho Task trong Project
 */
export const TaskSchema = z.object({
	id: z.string(),
	created_at: ApiDateSchema,
	updated_at: ApiDateSchema,
	project_id: z.string(),
	parent_id: z.string().nullable(),
	title: z.string().min(1, "Title cannot be empty"),
	description: z.string().optional().nullable(),
	status_id: z.string(),
	type_id: z.string(),
	priority_id: z.string(),
	// Removed assigner_id and assignee_ids
	started_at: ApiDateSchema.nullable().optional(),
	completed_at: ApiDateSchema.nullable().optional(),
	due_date: ApiDateSchema.nullable().optional(),
	order: z.number(),
	is_archived: z.boolean(),
	is_deleted: z.boolean(),
	// Các trường ảo hỗ trợ mapping UI, không nhất thiết có trong API response gốc hoặc được Join
	type: z
		.union([
			z.string(),
			z.object({ id: z.string(), name: z.string(), color: z.string() }),
		])
		.optional(),
	status: z
		.union([
			z.string(),
			z.object({
				id: z.string(),
				name: z.string(),
				color: z.string(),
				is_completed: z.boolean().optional(),
			}),
		])
		.optional(),
	priority: z
		.union([
			z.string(),
			z.object({ id: z.string(), name: z.string(), color: z.string() }),
		])
		.optional(),
	estimated_hours: z.number().optional(),
	actual_hours: z.number().optional(),
});

/**
 * Type đầy đủ của một Task bao gồm các thông tin liên quan (Join)
 */
export type TTask = z.infer<typeof TaskSchema> & {
	tags?: TTaskTag[];
	task_members?: TTaskMember[];
	sub_tasks?: TTask[];
	type_color?: string;
	status_color?: string;
	priority_color?: string;
};

/**
 * Schema cho việc tạo Task mới
 */
export const CreateTaskSchema = z.object({
	project_id: z.string().optional(),
	parent_id: z.string().nullable().optional(),
	title: z.string().min(1, "Title cannot be empty"),
	description: z.string().optional().nullable(),
	status_id: z.string(),
	type_id: z.string(),
	priority_id: z.string(),
	member_ids: z.array(z.string()).optional(), // Dùng thay cho assignee_ids
	started_at: ApiDateSchema.optional().nullable(), // Nay có thể optional lúc tạo
	due_date: ApiDateSchema,
	order: z.number().int(),
	estimated_hours: z.number().nullable().optional(),
	actual_hours: z.number().nullable().optional(),
});

export type TCreateTaskInput = z.infer<typeof CreateTaskSchema>;

/**
 * Type cho state của form Task trong detail view
 */
export type TTaskDetailFormValues = Omit<
	TCreateTaskInput,
	"due_date" | "member_ids" | "estimated_hours"
> & {
	due_date: Date;
	member_ids: string[];
	estimated_hours?: number;
	actual_hours?: number;
};

export type TTaskDetailFormApi = ReactFormApi<
	TTaskDetailFormValues,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any
>;

export type TTaskAIEstimationReasoningSteps = {
	similarity_analysis?: string;
	variance_analysis?: string;
};

export type TTaskAIEstimationExplanation = {
	suggested_hours: number;
	rationale: string;
	similar_cases_count?: number;
	reasoning_steps?: TTaskAIEstimationReasoningSteps;
};

/**
 * Schema cho việc cập nhật Task
 */
export const UpdateTaskSchema = CreateTaskSchema.omit({
	project_id: true,
})
	.partial()
	.extend({
		is_archived: z.boolean().optional(),
		completed_at: ApiDateSchema.optional().nullable(),
	});

export type TUpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

/**
 * Schema cho việc tìm kiếm/lọc danh sách Task
 */
export const FindTasksSchema = z
	.object({
		id__eq: z.string().optional(),
		title__ilike: z.string().optional(),
		team_id__eq: z.string().optional(),
		status_id__eq: z.string().optional(),
		member_ids__contains: z.array(z.string()).optional(),
		is_archived__eq: z.boolean().optional(),
		is_deleted__eq: z.boolean().optional(),
		page: FindPageSchema,
		page_size: FindPageSizeWithAllSchema,
		ordering: FindOrderingSchema,
	})
	.optional();

export type TFindTasksInput = z.infer<typeof FindTasksSchema>;

/**
 * Phản hồi từ API cho danh sách Task
 */
export type TTasksResponse = TBaseFindResponse<
	TTask,
	TBaseSearchOptions<number | "all", string>
>;

export type TMyTasksOverview = {
	in_progress: TTask[];
	upcoming: TTask[];
	overdue: TTask[];
};
