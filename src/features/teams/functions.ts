import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { isHTTPError } from "ky";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	CreateTeamSchema,
	FetchTeamByIdSchema,
	GetTeamsSchema,
	UpdateTeamInputSchema,
} from "./schemas";
import {
	createTeam,
	deleteTeam,
	fetchMyTeams,
	fetchTeamById,
	fetchTeams,
	updateTeam,
} from "./server";

export const fetchTeamsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(GetTeamsSchema)
	.handler(({ data }) => fetchTeams(data));

export const fetchMyTeamsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(() => fetchMyTeams());

export const fetchTeamByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(FetchTeamByIdSchema)
	.handler(async ({ data: teamId }) => {
		try {
			return await fetchTeamById(teamId);
		} catch (error) {
			if (isHTTPError(error) && error.response.status === 404) {
				throw notFound();
			}
			throw error;
		}
	});

export const createTeamFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(CreateTeamSchema)
	.handler(({ data }) => createTeam(data));

export const updateTeamFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(UpdateTeamInputSchema)
	.handler(({ data }) => updateTeam(data.teamId, data.payload));

export const deleteTeamFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(FetchTeamByIdSchema)
	.handler(({ data: teamId }) => deleteTeam(teamId));
