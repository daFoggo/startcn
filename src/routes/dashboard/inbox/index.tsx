import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/inbox/")({
	component: InboxPlaceholder,
});

function InboxPlaceholder() {
	return (
		<div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
			<div className="flex max-w-[420px] flex-col items-center justify-center text-center">
				<h3 className="mt-4 text-lg font-semibold">Inbox Page</h3>
				<p className="mt-2 mb-4 text-sm text-muted-foreground">
					This is a placeholder page for the inbox.
				</p>
			</div>
		</div>
	);
}
