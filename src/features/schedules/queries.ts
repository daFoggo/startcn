import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { getMySchedulesFn, upsertMyScheduleFn } from "./functions";
import type { TSchedule, TUpsertScheduleInput } from "./schemas";

export const scheduleKeys = {
	all: ["schedules"] as const,
	mine: () => [...scheduleKeys.all, "me"] as const,
};

export const formatSchedules = (
	schedules?: TSchedule[],
	teamId?: string,
	userId?: string,
) => {
	return Array.from({ length: 7 }).map((_, index) => {
		const existing = schedules?.find((s) => s.day_of_week === index);
		return {
			day_of_week: index,
			start_time: existing?.start_time ?? "09:00",
			end_time: existing?.end_time ?? "18:00",
			is_off: existing?.is_off ?? true,
			team_id: teamId || "",
			user_id: userId || "",
		};
	});
};

export const mySchedulesQueryOptions = () =>
	queryOptions({
		queryKey: scheduleKeys.mine(),
		queryFn: () => getMySchedulesFn(),
	});

export const useScheduleMutations = () => {
	const queryClient = useQueryClient();

	const upsert = useMutation({
		mutationFn: (payload: TUpsertScheduleInput) =>
			upsertMyScheduleFn({ data: payload }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: scheduleKeys.mine() });
		},
	});

	return { upsert };
};
