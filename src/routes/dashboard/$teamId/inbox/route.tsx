import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NestedErrorFallback } from "@/components/common/error-pages";
import { ViewModeList } from "@/components/layout/app/view-mode-list";
import { INBOX_VIEW_MODE_CATALOG } from "@/constants/view-mode-list";
import {
	InboxMarkAllReadButton,
	inboxStatsQueryOptions,
	type TInboxStats,
} from "@/features/inbox";

const toInboxBadgeMap = (stats: TInboxStats) => ({
	active: stats.active_count,
	bookmarks: stats.bookmarks_count,
	archive: stats.archive_count,
});

export const Route = createFileRoute("/dashboard/$teamId/inbox")({
	errorComponent: NestedErrorFallback,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(inboxStatsQueryOptions()),
	component: RouteComponent,
	staticData: {
		getTitle: () => "Inbox",
		fixedHeight: true,
	},
});

function RouteComponent() {
	const { teamId } = Route.useParams();
	const { data: stats } = useSuspenseQuery(inboxStatsQueryOptions());
	const badgeMap = toInboxBadgeMap(stats);

	return (
		<div className="flex flex-col gap-4 flex-1 min-h-0 h-full">
			<div className="flex items-center w-full gap-2 shrink-0">
				<ViewModeList
					catalog={INBOX_VIEW_MODE_CATALOG}
					scope="inbox"
					params={{ teamId }}
					badgeMap={badgeMap}
					allowCustomization={false}
				/>
				<InboxMarkAllReadButton />
			</div>
			<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
				<Outlet />
			</div>
		</div>
	);
}
