import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { TSchedule, TUpsertScheduleInput } from "./schemas";

/**
 * Get current user's 7-day recurring pattern config.
 */
export async function fetchMySchedules(): Promise<TSchedule[]> {
	const response = await api
		.get("schedules/me")
		.json<TBaseResponse<TSchedule[]>>();
	return response.data ?? [];
}

/**
 * Create or update a single day pattern for the current user.
 */
export async function upsertMySchedule(
	payload: TUpsertScheduleInput,
): Promise<TSchedule> {
	const response = await api
		.post("schedules/me", { json: payload })
		.json<TBaseResponse<TSchedule>>();

	return response.data;
}
