import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
} from "@tanstack/react-router";
import { AppPageHeader } from "@/components/layout/app/page-header";
import { AppSidebar } from "@/components/layout/app/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthMutations } from "@/features/auth";
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
		await context.queryClient.ensureQueryData(userMeQueryOptions());
	},
	component: DashboardLayout,
	staticData: {
		getTitle: () => "Dashboard",
	},
});

function DashboardLayout() {
	const matches = useMatches();
	const isFixedHeight = matches.some((m) => m.staticData.fixedHeight);

	// 1. Thông tin user hiện tại
	const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery(
		userMeQueryOptions(),
	);

	// 2. Sign out mutation (cho UserProfile)
	const { signOut: logoutMutation } = useAuthMutations();

	// Chuẩn bị props cho UserProfile
	const userProfileProps = {
		user: currentUser,
		logoutMutation: {
			mutateAsync: logoutMutation.mutateAsync,
			isPending: logoutMutation.isPending,
		},
	};

	return (
		<SidebarProvider className="h-svh overflow-hidden" disableKeyboardShortcut>
			<AppSidebar
				currentUser={currentUser}
				isCurrentUserLoading={isCurrentUserLoading}
				userProfileProps={userProfileProps}
			/>
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
