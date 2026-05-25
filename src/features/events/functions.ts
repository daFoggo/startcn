import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestLoggerMiddleware } from "@/lib/middleware";
import {
	CreateEventSchema,
	FindEventsSchema,
	UpdateEventSchema,
} from "./schemas";
import {
	createEvent,
	deleteEvent,
	fetchEventById,
	fetchEvents,
	updateEvent,
} from "./server";

export const getEventsFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(FindEventsSchema)
	.handler(async ({ data }) => {
		return await fetchEvents(data);
	});

export const getEventByIdFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		return await fetchEventById(data);
	});

export const createEventFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(CreateEventSchema)
	.handler(async ({ data }) => {
		return await createEvent(data);
	});

export const updateEventFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.object({ eventId: z.string(), payload: UpdateEventSchema }))
	.handler(async ({ data }) => {
		return await updateEvent(data);
	});

export const deleteEventFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(z.string())
	.handler(async ({ data }) => {
		return await deleteEvent(data);
	});
