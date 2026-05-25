import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { isHTTPError } from "ky";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	acceptInvitation,
	declineInvitation,
	fetchInvitationById,
	fetchMyInvitations,
} from "./server";

export const getMyInvitationsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		return await fetchMyInvitations();
	});

export const getInvitationByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ invitationId: z.string() }))
	.handler(async ({ data }) => {
		try {
			return await fetchInvitationById(data.invitationId);
		} catch (error) {
			if (isHTTPError(error) && error.response.status === 404) {
				throw notFound();
			}
			throw error;
		}
	});

export const acceptInvitationFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ invitationId: z.string() }))
	.handler(async ({ data }) => {
		return await acceptInvitation(data.invitationId);
	});

export const declineInvitationFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ invitationId: z.string() }))
	.handler(async ({ data }) => {
		return await declineInvitation(data.invitationId);
	});
