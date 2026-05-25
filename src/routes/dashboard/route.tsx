import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
} from "@tanstack/react-router";
import { AppPageHeader } from "@/components/layout/app/page-header";
import { AppSidebar } from "@/components/layout/app/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { inboxStatsQueryOptions } from "@/features/inbox";
import { myTeamsQueryOptions } from "@/features/teams";
import { userMeQueryOptions } from "@/features/users";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async ({ location }) => {
		const { getAuthToken } = await import("@/lib/auth-token");
		const token = await getAuthToken();
		if (!token) {
			throw redirect({
				to: "/auth/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(myTeamsQueryOptions()),
		]);
		void context.queryClient.prefetchQuery(inboxStatsQueryOptions());
	},
	component: DashboardLayout,
	staticData: {
		getTitle: () => "Dashboard",
	},
});

function DashboardLayout() {
	const matches = useMatches();
	const isFixedHeight = matches.some((m) => m.staticData.fixedHeight);

	return (
		<SidebarProvider className="h-svh overflow-hidden" disableKeyboardShortcut>
			<AppSidebar />
			<SidebarInset
				className={cn("h-full min-w-0", !isFixedHeight && "overflow-y-auto")}
			>
				<main
					className={cn(
						"flex flex-col gap-4 p-4 min-w-0",
						isFixedHeight && "h-full overflow-hidden",
					)}
				>
					<AppPageHeader />
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
