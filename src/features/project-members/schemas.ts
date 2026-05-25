import { z } from "zod";
import type { TBaseFindResponse, TBaseSearchOptions } from "@/types/api";
import { UserSchema } from "../users";

export const ProjectRoleSchema = z.enum([
	"owner",
	"manager",
	"member",
	"viewer",
]);

export const ProjectMemberSchema = z.object({
	id: z.string(),
	project_id: z.string(),
	user_id: z.string(),
	role: ProjectRoleSchema,
	joined_at: z.string().datetime(),
	user: UserSchema.optional(),
	created_at: z.string().datetime().optional(),
	updated_at: z.string().datetime().optional().nullable(),
});

export const AddProjectMemberSchema = z.object({
	user_id: z.string(),
	role: ProjectRoleSchema.default("member"),
});

export const UpdateProjectMemberRoleSchema = z.object({
	role: ProjectRoleSchema,
});

export const AddProjectMemberInputSchema = z.object({
	projectId: z.string(),
	payload: AddProjectMemberSchema,
});

export const UpdateProjectMemberRoleInputSchema = z.object({
	projectId: z.string(),
	user_id: z.string(),
	payload: UpdateProjectMemberRoleSchema,
});

export const RemoveProjectMemberSchema = z.object({
	projectId: z.string(),
	user_id: z.string(),
});

export const ProjectInviteGenerateRequestSchema = z.object({
	email: z.string().email(),
	role: ProjectRoleSchema,
});

export const ProjectInviteAcceptRequestSchema = z.object({
	token: z.string(),
});

export type TProjectMemberSearchOptions = TBaseSearchOptions<number, string>;

export type TProjectMembersResponse = TBaseFindResponse<
	TProjectMember,
	TProjectMemberSearchOptions
>;

export type TProjectRole = z.infer<typeof ProjectRoleSchema>;
export type TProjectMember = z.infer<typeof ProjectMemberSchema>;
export type TAddProjectMemberPayload = z.infer<typeof AddProjectMemberSchema>;
export type TUpdateProjectMemberRolePayload = z.infer<
	typeof UpdateProjectMemberRoleSchema
>;
export type TAddProjectMemberInput = z.infer<
	typeof AddProjectMemberInputSchema
>;
export type TUpdateProjectMemberRoleInput = z.infer<
	typeof UpdateProjectMemberRoleInputSchema
>;

export type TProjectInviteGenerateRequest = z.infer<
	typeof ProjectInviteGenerateRequestSchema
>;
export type TProjectInviteTokenResponse = { token: string };
export type TProjectInviteAcceptRequest = z.infer<
	typeof ProjectInviteAcceptRequestSchema
>;
