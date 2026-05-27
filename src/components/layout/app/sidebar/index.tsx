import { useLocation } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { SIDEBAR_PERSONAL, SIDEBAR_TEAM } from "@/constants/sidebar-navigation";
import type { TUser } from "@/features/users";
import { useSidebarContextStore } from "@/stores/use-sidebar-context-store";
import { HeaderContent } from "./header-content";
import { SidebarGroupSection } from "./sidebar-navigation";
import { ThemeToggleWrapper } from "./theme-toggle-wrapper";
import { UserProfile } from "./user-profile";

export interface IAppSidebarProps {
	currentUser?: TUser;
	isCurrentUserLoading: boolean;
	userProfileProps: {
		user?: TUser;
		logoutMutation: {
			mutateAsync: () => Promise<void>;
			isPending: boolean;
		};
	};
}

export const AppSidebar = ({
	currentUser: _currentUser,
	isCurrentUserLoading: _isCurrentUserLoading,
	userProfileProps,
}: IAppSidebarProps) => {
	const { pathname } = useLocation();
	const syncWithPathname = useSidebarContextStore(
		(state) => state.syncWithPathname,
	);

	useEffect(() => {
		syncWithPathname(pathname);
	}, [pathname, syncWithPathname]);

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<HeaderContent />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroupSection group={SIDEBAR_PERSONAL} />
				<SidebarGroupSection group={SIDEBAR_TEAM} />

				<SidebarGroup className="mt-auto">
					<SidebarMenu>
						<ThemeToggleWrapper />
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<Suspense
						fallback={
							<SidebarMenuItem>
								<SidebarMenuButton disabled>
									<div className="flex items-center gap-2">
										<Skeleton className="size-8 rounded-full" />
										<div className="flex flex-col gap-1">
											<Skeleton className="h-3 w-20" />
											<Skeleton className="h-2 w-24" />
										</div>
									</div>
								</SidebarMenuButton>
							</SidebarMenuItem>
						}
					>
						<UserProfile {...userProfileProps} />
					</Suspense>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
