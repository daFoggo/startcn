import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
} from "@tanstack/react-router";
import type React from "react";
import { AppHeader } from "@/components/layout/app/header";
import { AppPageContainer } from "@/components/layout/app/page-container";
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
	const pageContainerSize =
		[...matches].reverse().find((m) => m.staticData.pageContainerSize)
			?.staticData.pageContainerSize ?? "default";

	// Dynamic layout parameter from route configuration to hide sidebar completely
	const hideSidebar = matches.some((m) => (m.staticData as any).hideSidebar);

	// 1. Current user information
	const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery(
		userMeQueryOptions(),
	);

	// 2. Sign out mutation
	const { signOut: logoutMutation } = useAuthMutations();

	return (
		<SidebarProvider
			className="flex flex-col h-svh w-full overflow-hidden bg-background"
			style={{ "--header-height": "3rem" } as React.CSSProperties}
		>
			{/* 1. Global Top Sticky Header */}
			<AppHeader user={currentUser} logoutMutation={logoutMutation} />

			{/* 2. Main Content & Sidebar Partition */}
			<div className="flex flex-1 min-h-0 w-full overflow-hidden bg-background">
				{/* The Single Collapsible Sidebar */}
				{!hideSidebar && (
					<AppSidebar
						currentUser={currentUser}
						isCurrentUserLoading={isCurrentUserLoading}
					/>
				)}

				{/* Content Inset Wrapper */}
				<SidebarInset
					className={cn(
						"h-full min-w-0 bg-background",
						!isFixedHeight && "overflow-y-auto",
					)}
				>
					<main
						className={cn(
							"min-w-0 bg-background",
							isFixedHeight && "h-full overflow-hidden",
						)}
					>
						<AppPageContainer
							fixedHeight={isFixedHeight}
							size={pageContainerSize}
						>
							<Outlet />
						</AppPageContainer>
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
