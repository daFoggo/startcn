import { z } from "zod";
import { ApiDateSchema } from "@/lib/zod-common";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import { createFindOptionsSchema } from "./base";

export const TaskStatusSchema = z.object({
	id: z.string(),
	created_at: ApiDateSchema,
	updated_at: ApiDateSchema,
	project_id: z.string(),
	name: z.string().min(1),
	color: z.string(),
	order: z.number(),
	is_default: z.boolean(),
	is_completed: z.boolean(),
});

export const TaskStatusCreateSchema = z.object({
	project_id: z.string().optional(),
	name: z.string().min(1),
	color: z.string(),
	order: z.number().int(),
	is_default: z.boolean().optional(),
	is_completed: z.boolean().optional(),
});

export const TaskStatusUpdateSchema = TaskStatusCreateSchema.omit({
	project_id: true,
})
	.partial()
	.extend({
		is_default: z.boolean().optional(),
		is_completed: z.boolean().optional(),
	});

export const TaskStatusFindSchema = createFindOptionsSchema({
	id__eq: z.string().optional(),
	name__ilike: z.string().optional(),
	is_default__eq: z.boolean().optional(),
	is_completed__eq: z.boolean().optional(),
	level__eq: z.number().int().optional(),
});

export type TTaskStatusSearchOptions = TBaseSearchOptions<
	number | "all",
	string
>;

export type TTaskStatusesResponse = TBaseFindResponse<
	TTaskStatus,
	TTaskStatusSearchOptions
>;

export type TTaskStatus = z.infer<typeof TaskStatusSchema>;
export type TTaskStatusCreateInput = z.infer<typeof TaskStatusCreateSchema>;
export type TTaskStatusUpdateInput = z.infer<typeof TaskStatusUpdateSchema>;
export type TTaskStatusFindInput = z.infer<typeof TaskStatusFindSchema>;
