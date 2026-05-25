import { z } from "zod";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import { UserSchema } from "../users";

export const TeamRoleSchema = z.enum(["owner", "manager", "member", "viewer"]);

export const TeamMemberSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	team_id: z.string(),
	role: TeamRoleSchema,
	joined_at: z.string(),
	created_at: z.string().optional(),
	updated_at: z.string().optional().nullable(),
	user: UserSchema.optional(),
});

export const FetchTeamMembersSchema = z.object({
	teamId: z.string(),
	q: z.string().optional(),
});

export const AddTeamMemberSchema = z.object({
	role: TeamRoleSchema.default("member"),
	user_id: z.string(),
});

export const UpdateTeamMemberRoleSchema = z.object({
	role: TeamRoleSchema,
});

export const AddTeamMemberInputSchema = z.object({
	teamId: z.string(),
	payload: AddTeamMemberSchema,
});

export const UpdateTeamMemberRoleInputSchema = z.object({
	teamId: z.string(),
	user_id: z.string(),
	payload: UpdateTeamMemberRoleSchema,
});

export const RemoveTeamMemberSchema = z.object({
	teamId: z.string(),
	user_id: z.string(),
});

export const TeamInviteGenerateRequestSchema = z.object({
	email: z.string().email(),
	role: TeamRoleSchema,
});

export const TeamInviteAcceptRequestSchema = z.object({
	token: z.string(),
});

export type TTeamMemberSearchOptions = TBaseSearchOptions<
	number,
	string | null
>;

export type TTeamMembersResponse = TBaseFindResponse<
	TTeamMember,
	TTeamMemberSearchOptions
>;

export type TTeamRole = z.infer<typeof TeamRoleSchema>;
export type TTeamMember = z.infer<typeof TeamMemberSchema>;
export type TAddTeamMemberPayload = z.infer<typeof AddTeamMemberSchema>;
export type TUpdateTeamMemberRolePayload = z.infer<
	typeof UpdateTeamMemberRoleSchema
>;
export type TAddTeamMemberInput = z.infer<typeof AddTeamMemberInputSchema>;
export type TUpdateTeamMemberRoleInput = z.infer<
	typeof UpdateTeamMemberRoleInputSchema
>;

export type TTeamInviteGenerateRequest = z.infer<
	typeof TeamInviteGenerateRequestSchema
>;
export type TTeamInviteTokenResponse = { token: string };
export type TTeamInviteAcceptRequest = z.infer<
	typeof TeamInviteAcceptRequestSchema
>;
