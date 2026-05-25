import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GetInboxStatsSchema, InboxStatusSchema } from "./schemas";
import {
	archiveInboxItem,
	deleteInboxItem,
	fetchInboxList,
	fetchInboxStats,
	markAllInboxAsRead,
	markInboxAsRead,
	toggleInboxBookmark,
	unarchiveInboxItem,
} from "./server";

export const getInboxStatsFn = createServerFn({ method: "GET" })
	.inputValidator(GetInboxStatsSchema)
	.handler(() => fetchInboxStats());

export const getInboxListFn = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			status: InboxStatusSchema.optional(),
			isRead: z.boolean().optional(),
			isBookmarked: z.boolean().optional(),
		}),
	)
	.handler(({ data }) =>
		fetchInboxList(data.status, data.isRead, data.isBookmarked),
	);

export const toggleInboxBookmarkFn = createServerFn({ method: "POST" })
	.inputValidator(z.object({ inboxItemId: z.string() }))
	.handler(({ data }) => toggleInboxBookmark(data.inboxItemId));

export const markInboxAsReadFn = createServerFn({ method: "POST" })
	.inputValidator(z.object({ inboxItemId: z.string() }))
	.handler(({ data }) => markInboxAsRead(data.inboxItemId));

export const markAllInboxAsReadFn = createServerFn({ method: "POST" }).handler(
	() => markAllInboxAsRead(),
);

export const archiveInboxFn = createServerFn({ method: "POST" })
	.inputValidator(z.object({ inboxItemId: z.string() }))
	.handler(({ data }) => archiveInboxItem(data.inboxItemId));

export const unarchiveInboxFn = createServerFn({ method: "POST" })
	.inputValidator(z.object({ inboxItemId: z.string() }))
	.handler(({ data }) => unarchiveInboxItem(data.inboxItemId));

export const deleteInboxFn = createServerFn({ method: "POST" })
	.inputValidator(z.object({ inboxItemId: z.string() }))
	.handler(({ data }) => deleteInboxItem(data.inboxItemId));
