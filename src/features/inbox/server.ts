import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import type { TInboxItem, TInboxStats, TInboxStatus } from "./schemas";

export const fetchInboxStats = async (): Promise<TInboxStats> => {
	const response = await api
		.get("notifications/stats")
		.json<TBaseResponse<TInboxStats>>();
	return response.data;
};

export const fetchInboxList = async (
	status: TInboxStatus = "ACTIVE",
	isRead?: boolean,
	isBookmarked?: boolean,
): Promise<TInboxItem[]> => {
	const response = await api
		.get("notifications/me", {
			searchParams: {
				status,
				...(isRead !== undefined && { is_read: isRead }),
				...(isBookmarked !== undefined && { is_bookmarked: isBookmarked }),
			},
		})
		.json<TBaseResponse<TInboxItem[]>>();
	return response.data;
};

export const toggleInboxBookmark = async (
	inboxItemId: string,
): Promise<TInboxItem> => {
	const response = await api
		.patch(`notifications/${inboxItemId}/bookmark`)
		.json<TBaseResponse<TInboxItem>>();
	return response.data;
};

export const markInboxAsRead = async (
	inboxItemId: string,
): Promise<TInboxItem> => {
	const response = await api
		.patch(`notifications/${inboxItemId}/read`)
		.json<TBaseResponse<TInboxItem>>();
	return response.data;
};

export const markAllInboxAsRead = async (): Promise<boolean> => {
	const response = await api
		.post("notifications/read-all")
		.json<TBaseResponse<boolean>>();
	return response.data;
};

export const archiveInboxItem = async (
	inboxItemId: string,
): Promise<TInboxItem> => {
	const response = await api
		.patch(`notifications/${inboxItemId}/archive`)
		.json<TBaseResponse<TInboxItem>>();
	return response.data;
};

export const unarchiveInboxItem = async (
	inboxItemId: string,
): Promise<TInboxItem> => {
	const response = await api
		.patch(`notifications/${inboxItemId}/unarchive`)
		.json<TBaseResponse<TInboxItem>>();
	return response.data;
};

export const deleteInboxItem = async (
	inboxItemId: string,
): Promise<boolean> => {
	const response = await api
		.delete(`notifications/${inboxItemId}`)
		.json<TBaseResponse<boolean>>();
	return response.data;
};
