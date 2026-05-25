import { z } from "zod";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import type { TProject } from "../projects";
import type { TTeamMember } from "../team-members";

export const TeamStatsSchema = z.object({
	total_tasks: z.number(),
	completed_tasks: z.number(),
	weekly_activity: z.array(z.number()),
});
export type TTeamStats = z.infer<typeof TeamStatsSchema>;

export const TeamSchema = z.object({
	id: z.string(),
	name: z.string().min(2, "Team name must be at least 2 characters"),
	description: z.string().optional().nullable(),
	avatar_url: z.string().optional().nullable(),
	owner_id: z.string(),
	is_deleted: z.boolean().default(false),
	created_at: z.string(),
	updated_at: z.string().optional().nullable(),
	stats: TeamStatsSchema.optional().nullable(),
});

export const CreateTeamSchema = z.object({
	name: z.string().min(2, "Team name must be at least 2 characters"),
	description: z.string().optional(),
	avatar_url: z.string().optional(),
});

export const UpdateTeamSchema = CreateTeamSchema.partial();

export const GetTeamsSchema = z
	.object({
		ordering: z.string().optional(),
		page: z.number().optional(),
		page_size: z.number().optional(),
		id__eq: z.string().optional(),
		name__ilike: z.string().optional(),
		owner_id__eq: z.string().optional(),
		is_deleted__eq: z.boolean().optional(),
	})
	.optional();

export const FetchTeamByIdSchema = z.string();

export const UpdateTeamInputSchema = z.object({
	teamId: z.string(),
	payload: UpdateTeamSchema,
});

export type TTeamSearchOptions = TBaseSearchOptions<number, string | null>;

export type TTeamsResponse = TBaseFindResponse<TTeam, TTeamSearchOptions>;

export type TTeam = z.infer<typeof TeamSchema> & {
	members?: TTeamMember[];
	projects?: TProject[];
};
export type TCreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type TUpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
