import { createServerFn } from "@tanstack/react-start";
import { requestLoggerMiddleware } from "@/lib/middleware";
import { UpsertScheduleSchema } from "./schemas";
import { fetchMySchedules, upsertMySchedule } from "./server";

export const getMySchedulesFn = createServerFn({ method: "GET" })
	.middleware([requestLoggerMiddleware])
	.handler(async () => {
		return await fetchMySchedules();
	});

export const upsertMyScheduleFn = createServerFn({ method: "POST" })
	.middleware([requestLoggerMiddleware])
	.inputValidator(UpsertScheduleSchema)
	.handler(async ({ data }) => {
		return await upsertMySchedule(data);
	});
