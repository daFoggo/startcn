import { z } from "zod";

export const ProjectOrganizationSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(255),
});

export const ProjectSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(255),
	organization: ProjectOrganizationSchema,
});

export const ProjectStatsSchema = z.object({
	coverage: z.number().min(0).max(100),
	pendingQuestions: z.number().min(0),
	autoResolvedEvents: z.number().min(0),
});

export const ProjectListItemSchema = z.object({
	project: ProjectSchema,
	stats: ProjectStatsSchema,
});

export const ProjectByIdInputSchema = z.object({
	projectId: z.string().min(1),
});

export type TProjectOrganization = z.infer<typeof ProjectOrganizationSchema>;
export type TProject = z.infer<typeof ProjectSchema>;
export type TProjectStats = z.infer<typeof ProjectStatsSchema>;
export type TProjectListItem = z.infer<typeof ProjectListItemSchema>;
export type TProjectByIdInput = z.infer<typeof ProjectByIdInputSchema>;
