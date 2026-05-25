import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	AddProjectMemberInputSchema,
	ProjectInviteAcceptRequestSchema,
	ProjectInviteGenerateRequestSchema,
	RemoveProjectMemberSchema,
	UpdateProjectMemberRoleInputSchema,
} from "./schemas";
import {
	acceptProjectInvite,
	addProjectMember,
	fetchProjectMembers,
	generateProjectInvite,
	removeProjectMember,
	updateProjectMemberRole,
} from "./server";

export const getProjectMembersFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ projectId: z.string() }))
	.handler(async ({ data }) => {
		return await fetchProjectMembers(data.projectId);
	});

export const addProjectMemberFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(AddProjectMemberInputSchema)
	.handler(async ({ data }) => {
		return await addProjectMember(data);
	});

export const updateProjectMemberRoleFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(UpdateProjectMemberRoleInputSchema)
	.handler(async ({ data }) => {
		return await updateProjectMemberRole(data);
	});

export const removeProjectMemberFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(RemoveProjectMemberSchema)
	.handler(async ({ data }) => {
		return await removeProjectMember(data.projectId, data.user_id);
	});

export const generateProjectInviteFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({
			projectId: z.string(),
			payload: ProjectInviteGenerateRequestSchema,
		}),
	)
	.handler(async ({ data }) => {
		return await generateProjectInvite(data.projectId, data.payload);
	});

export const acceptProjectInviteFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(ProjectInviteAcceptRequestSchema)
	.handler(async ({ data }) => {
		return await acceptProjectInvite(data);
	});
