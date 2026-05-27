import { IconInbox } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/dashboard/inbox/")({
	component: InboxPlaceholder,
	staticData: {
		getTitle: () => "Inbox",
	},
});

function InboxPlaceholder() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconInbox />
				</EmptyMedia>
				<EmptyTitle>Inbox Page</EmptyTitle>
				<EmptyDescription>
					This is a placeholder page for the inbox.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
