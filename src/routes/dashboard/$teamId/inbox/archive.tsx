import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { inboxListQueryOptions } from "@/features/inbox";
import { InboxViewContainer } from "./-inbox-view-container";

export const Route = createFileRoute("/dashboard/$teamId/inbox/archive")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(inboxListQueryOptions("ARCHIVED")),
	component: ArchiveInboxView,
});

function ArchiveInboxView() {
	const { data: items } = useSuspenseQuery(inboxListQueryOptions("ARCHIVED"));

	return <InboxViewContainer items={items} />;
}
