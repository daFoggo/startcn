import { z } from "zod";
import { ApiDateSchema } from "@/lib/zod-common";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import { createFindOptionsSchema } from "./base";

export const TaskTypeSchema = z.object({
	id: z.string(),
	created_at: ApiDateSchema,
	updated_at: ApiDateSchema,
	project_id: z.string(),
	name: z.string().min(1),
	color: z.string(),
	icon: z.string(),
	order: z.number(),
	is_default: z.boolean(),
});

export const TaskTypeCreateSchema = z.object({
	project_id: z.string().optional(),
	name: z.string().min(1),
	color: z.string(),
	icon: z.string(),
	order: z.number().int(),
	is_default: z.boolean().optional(),
});

export const TaskTypeUpdateSchema = TaskTypeCreateSchema.omit({
	project_id: true,
}).partial();

export const TaskTypeFindSchema = createFindOptionsSchema({
	id__eq: z.string().optional(),
	name__ilike: z.string().optional(),
	is_default__eq: z.boolean().optional(),
});

export type TTaskTypeSearchOptions = TBaseSearchOptions<number | "all", string>;

export type TTaskTypesResponse = TBaseFindResponse<
	TTaskType,
	TTaskTypeSearchOptions
>;

export type TTaskType = z.infer<typeof TaskTypeSchema>;
export type TTaskTypeCreateInput = z.infer<typeof TaskTypeCreateSchema>;
export type TTaskTypeUpdateInput = z.infer<typeof TaskTypeUpdateSchema>;
export type TTaskTypeFindInput = z.infer<typeof TaskTypeFindSchema>;
