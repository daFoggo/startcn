import { z } from "zod";
import { ApiDateSchema } from "@/lib/zod-common";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import { createFindOptionsSchema } from "./base";

export const TaskTagSchema = z.object({
	id: z.string(),
	created_at: ApiDateSchema,
	updated_at: ApiDateSchema,
	project_id: z.string(),
	name: z.string().min(1),
	color: z.string(),
});

export const TaskTagCreateSchema = z.object({
	project_id: z.string().optional(),
	name: z.string().min(1),
	color: z.string(),
});

export const TaskTagUpdateSchema = TaskTagCreateSchema.omit({
	project_id: true,
}).partial();

export const TaskTagFindSchema = createFindOptionsSchema({
	id__eq: z.string().optional(),
	name__ilike: z.string().optional(),
});

export type TTaskTagSearchOptions = TBaseSearchOptions<number | "all", string>;

export type TTaskTagsResponse = TBaseFindResponse<
	TTaskTag,
	TTaskTagSearchOptions
>;

export type TTaskTag = z.infer<typeof TaskTagSchema>;
export type TTaskTagCreateInput = z.infer<typeof TaskTagCreateSchema>;
export type TTaskTagUpdateInput = z.infer<typeof TaskTagUpdateSchema>;
export type TTaskTagFindInput = z.infer<typeof TaskTagFindSchema>;
