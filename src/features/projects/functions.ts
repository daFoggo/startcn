import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { isHTTPError } from "ky";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	CreateProjectSchema,
	GetProjectSchema,
	GetProjectsSchema,
	StatsPeriodSchema,
	UpdateProjectSchema,
} from "./schemas";
import {
	createProject,
	deleteProject,
	fetchMyProjects,
	fetchProjectById,
	fetchProjectMemberWorkload,
	fetchProjectRecentStatusUpdates,
	fetchProjects,
	fetchProjectTaskStats,
	updateProject,
} from "./server";

export const getProjectsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(GetProjectsSchema)
	.handler(async ({ data }) => {
		const res = await fetchProjects(data);
		return res ?? [];
	});

export const getMyProjectsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ teamId: z.string().optional() }).optional())
	.handler(async ({ data }) => {
		const res = await fetchMyProjects(data?.teamId);
		return res ?? [];
	});

export const getProjectByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(GetProjectSchema)
	.handler(async ({ data }) => {
		try {
			return await fetchProjectById(data.projectId);
		} catch (error) {
			if (isHTTPError(error) && error.response.status === 404) {
				throw notFound();
			}
			throw error;
		}
	});

export const createProjectFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(CreateProjectSchema)
	.handler(async ({ data }) => {
		return await createProject(data);
	});

export const updateProjectFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({ projectId: z.string(), payload: UpdateProjectSchema }),
	)
	.handler(async ({ data }) => {
		return await updateProject(data.projectId, data.payload);
	});

export const deleteProjectFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		return await deleteProject(data);
	});

export const fetchProjectTaskStatsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({ projectId: z.string(), period: StatsPeriodSchema.optional() }),
	)
	.handler(async ({ data }) => {
		return await fetchProjectTaskStats(data.projectId, data.period ?? "weekly");
	});

export const fetchProjectMemberWorkloadFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({ projectId: z.string(), period: StatsPeriodSchema.optional() }),
	)
	.handler(async ({ data }) => {
		return await fetchProjectMemberWorkload(
			data.projectId,
			data.period ?? "weekly",
		);
	});

export const fetchProjectRecentStatusUpdatesFn = createServerFn({
	method: "GET",
})
	.middleware([requestLoggerMiddleware])
	.inputValidator(
		z.object({ projectId: z.string(), limit: z.number().optional() }),
	)
	.handler(async ({ data }) => {
		return await fetchProjectRecentStatusUpdates(
			data.projectId,
			data.limit ?? 10,
		);
	});
