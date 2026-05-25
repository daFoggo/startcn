import { z } from "zod";
import { ProjectSchema } from "@/features/projects";
import { TeamSchema } from "@/features/teams";
import { UserSchema } from "@/features/users";

export const InvitationStatusSchema = z.enum([
	"PENDING",
	"ACCEPTED",
	"DECLINED",
]);

export const InvitationSchema = z.object({
	id: z.string(),
	email: z.string(),
	inviter_id: z.string(),
	team_id: z.string().nullable().optional(),
	project_id: z.string().nullable().optional(),
	role: z.string(),
	status: InvitationStatusSchema,
	created_at: z.string(),
	updated_at: z.string(),

	inviter: UserSchema.optional(),
	team: TeamSchema.optional(),
	project: ProjectSchema.optional(),
});

export type TInvitation = z.infer<typeof InvitationSchema>;
