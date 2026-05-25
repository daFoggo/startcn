import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { inboxListQueryOptions } from "@/features/inbox";
import { InboxViewContainer } from "./-inbox-view-container";

export const Route = createFileRoute("/dashboard/$teamId/inbox/bookmarks")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(inboxListQueryOptions("BOOKMARKED")),
	component: BookmarkedInboxView,
});

function BookmarkedInboxView() {
	const { data: items } = useSuspenseQuery(inboxListQueryOptions("BOOKMARKED"));

	return <InboxViewContainer items={items} />;
}
