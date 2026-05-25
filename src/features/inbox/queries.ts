import { queryOptions } from "@tanstack/react-query";
import { getInboxListFn, getInboxStatsFn } from "./functions";
import type {
	GetInboxStatsInput,
	TInboxItem,
	TInboxStats,
	TInboxStatus,
} from "./schemas";

export const inboxKeys = {
	all: ["inbox"] as const,
	stats: () => [...inboxKeys.all, "stats"] as const,
	list: (status?: TInboxStatus, isRead?: boolean, isBookmarked?: boolean) =>
		[...inboxKeys.all, "list", status, isRead, isBookmarked] as const,
};

export const inboxStatsQueryOptions = (params: GetInboxStatsInput = {}) =>
	queryOptions({
		queryKey: inboxKeys.stats(),
		queryFn: () => getInboxStatsFn({ data: params }) as Promise<TInboxStats>,
		staleTime: 1000 * 60 * 2, // 2 minutes
		refetchInterval: 6000,
	});

export const inboxListQueryOptions = (
	status?: TInboxStatus,
	isRead?: boolean,
	isBookmarked?: boolean,
) =>
	queryOptions({
		queryKey: inboxKeys.list(status, isRead, isBookmarked),
		queryFn: () =>
			getInboxListFn({ data: { status, isRead, isBookmarked } }) as Promise<
				TInboxItem[]
			>,
		staleTime: 1000 * 30, // 30 seconds
		refetchInterval: 6000,
	});

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	archiveInboxFn,
	deleteInboxFn,
	markAllInboxAsReadFn,
	markInboxAsReadFn,
	toggleInboxBookmarkFn,
	unarchiveInboxFn,
} from "./functions";

export const useInboxMutations = () => {
	const queryClient = useQueryClient();
	const refresh = () =>
		queryClient.invalidateQueries({ queryKey: inboxKeys.all });

	const markAllAsRead = useMutation({
		mutationFn: () => markAllInboxAsReadFn(),
		onSuccess: refresh,
	});

	const markAsRead = useMutation({
		mutationFn: (id: string) =>
			markInboxAsReadFn({ data: { inboxItemId: id } }),
		onSuccess: refresh,
	});

	const toggleBookmark = useMutation({
		mutationFn: (id: string) =>
			toggleInboxBookmarkFn({ data: { inboxItemId: id } }),
		onSuccess: refresh,
	});

	const archive = useMutation({
		mutationFn: (id: string) => archiveInboxFn({ data: { inboxItemId: id } }),
		onSuccess: refresh,
	});

	const unarchive = useMutation({
		mutationFn: (id: string) => unarchiveInboxFn({ data: { inboxItemId: id } }),
		onSuccess: refresh,
	});

	const remove = useMutation({
		mutationFn: (id: string) => deleteInboxFn({ data: { inboxItemId: id } }),
		onSuccess: refresh,
	});

	return {
		markAllAsRead,
		markAsRead,
		toggleBookmark,
		archive,
		unarchive,
		remove,
	};
};
