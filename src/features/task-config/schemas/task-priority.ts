import { z } from "zod";
import { ApiDateSchema } from "@/lib/zod-common";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import { createFindOptionsSchema } from "./base";

export const TaskPrioritySchema = z.object({
	id: z.string(),
	created_at: ApiDateSchema,
	updated_at: ApiDateSchema,
	project_id: z.string(),
	name: z.string().min(1),
	color: z.string(),
	level: z.number().int().min(0).max(3),
	order: z.number(),
	is_default: z.boolean(),
});

export const TaskPriorityCreateSchema = z.object({
	project_id: z.string().optional(),
	name: z.string().min(1),
	color: z.string(),
	level: z.number().int().min(0).max(3),
	order: z.number().int(),
	is_default: z.boolean().optional(),
});

export const TaskPriorityUpdateSchema = TaskPriorityCreateSchema.omit({
	project_id: true,
}).partial();

export const TaskPriorityFindSchema = createFindOptionsSchema({
	id__eq: z.string().optional(),
	name__ilike: z.string().optional(),
	level__eq: z.number().int().optional(),
	is_default__eq: z.boolean().optional(),
});

export type TTaskPrioritySearchOptions = TBaseSearchOptions<
	number | "all",
	string
>;

export type TTaskPrioritiesResponse = TBaseFindResponse<
	TTaskPriority,
	TTaskPrioritySearchOptions
>;

export type TTaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TTaskPriorityCreateInput = z.infer<typeof TaskPriorityCreateSchema>;
export type TTaskPriorityUpdateInput = z.infer<typeof TaskPriorityUpdateSchema>;
export type TTaskPriorityFindInput = z.infer<typeof TaskPriorityFindSchema>;
