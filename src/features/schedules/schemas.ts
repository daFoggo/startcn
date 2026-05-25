import { z } from "zod";

export const ScheduleSchema = z.object({
	id: z.string(),
	team_id: z.string(),
	user_id: z.string(),
	day_of_week: z.number().min(0).max(6), // 0: Sunday, 1: Monday, ..., 6: Saturday
	start_time: z.string().nullable(),
	end_time: z.string().nullable(),
	is_off: z.boolean(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

export type TSchedule = z.infer<typeof ScheduleSchema>;

export const UpsertScheduleSchema = z.object({
	team_id: z.string(),
	user_id: z.string(),
	day_of_week: z.number().min(0).max(6),
	start_time: z.string().nullable(),
	end_time: z.string().nullable(),
	is_off: z.boolean(),
});

export type TUpsertScheduleInput = z.infer<typeof UpsertScheduleSchema>;
