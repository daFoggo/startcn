import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/general")({
	component: GeneralPlaceholder,
});

function GeneralPlaceholder() {
	return (
		<div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
			<div className="flex max-w-[420px] flex-col items-center justify-center text-center">
				<h3 className="mt-4 text-lg font-semibold">General Settings</h3>
				<p className="mt-2 mb-4 text-sm text-muted-foreground">
					This is a placeholder page for general system settings.
				</p>
			</div>
		</div>
	);
}
