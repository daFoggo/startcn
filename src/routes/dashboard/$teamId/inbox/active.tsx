import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { inboxListQueryOptions } from "@/features/inbox";
import { InboxViewContainer } from "./-inbox-view-container";

export const Route = createFileRoute("/dashboard/$teamId/inbox/active")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(inboxListQueryOptions("ACTIVE")),
	component: ActiveInboxView,
});

function ActiveInboxView() {
	const { data: items } = useSuspenseQuery(inboxListQueryOptions("ACTIVE"));

	return <InboxViewContainer items={items} />;
}
