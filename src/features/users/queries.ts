import { queryOptions } from "@tanstack/react-query";
import {
	fetchUserStatsFn,
	getUserGreetingFn,
	getUserMeFn,
	searchUsersFn,
} from "./functions";
import type { TStatsPeriod } from "./schemas";

export const userKeys = {
	all: ["users"] as const,
	me: () => [...userKeys.all, "me"] as const,
	greeting: () => [...userKeys.all, "greeting"] as const,
	searches: () => [...userKeys.all, "search"] as const,
	search: (q: string, options?: any) =>
		[...userKeys.searches(), q, options] as const,
	statsAll: () => [...userKeys.all, "stats"] as const,
	stats: (period: TStatsPeriod) => [...userKeys.statsAll(), period] as const,
};

export const userMeQueryOptions = () =>
	queryOptions({
		queryKey: userKeys.me(),
		queryFn: () => getUserMeFn(),
	});

export const userGreetingQueryOptions = () =>
	queryOptions({
		queryKey: userKeys.greeting(),
		queryFn: () => getUserGreetingFn() as Promise<string>,
	});

export const searchUsersQueryOptions = (
	q: string,
	options?: {
		teamId?: string;
		excludeTeamId?: string;
		excludeProjectId?: string;
	},
) =>
	queryOptions({
		queryKey: userKeys.search(q, options),
		queryFn: () =>
			searchUsersFn({
				data: {
					q,
					teamId: options?.teamId,
					excludeTeamId: options?.excludeTeamId,
					excludeProjectId: options?.excludeProjectId,
					limit: 10,
				},
			}),
		enabled: q.length >= 1,
	});

export const userStatsQueryOptions = (period: TStatsPeriod = "weekly") =>
	queryOptions({
		queryKey: userKeys.stats(period),
		queryFn: () => fetchUserStatsFn({ data: { period } }),
	});
