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
import {
	SIDEBAR_PERSONAL,
	SIDEBAR_SETTINGS_MENU,
	SIDEBAR_TEAM,
} from "@/constants/sidebar-navigation";
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

/**
 * Thành phần Sidebar chính của ứng dụng Dashboard.
 * Quản lý Navigation, tự động chuyển đổi Menu theo ngữ cảnh hoạt động (chính vs cài đặt).
 */
export const AppSidebar = ({
	currentUser: _currentUser,
	isCurrentUserLoading: _isCurrentUserLoading,
	userProfileProps,
}: IAppSidebarProps) => {
	const { pathname } = useLocation();
	const activeContextId = useSidebarContextStore(
		(state) => state.activeContextId,
	);
	const syncWithPathname = useSidebarContextStore(
		(state) => state.syncWithPathname,
	);

	useEffect(() => {
		syncWithPathname(pathname);
	}, [pathname, syncWithPathname]);

	const isSettingsContext = activeContextId === "settings";

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<HeaderContent />
			</SidebarHeader>
			<SidebarContent>
				{isSettingsContext ? (
					/* Nhóm Menu Settings hệ thống */
					<SidebarGroupSection group={SIDEBAR_SETTINGS_MENU} />
				) : (
					<>
						{/* Nhóm Menu cá nhân */}
						<SidebarGroupSection group={SIDEBAR_PERSONAL} />

						{/* Nhóm Menu Team */}
						<SidebarGroupSection group={SIDEBAR_TEAM} />
					</>
				)}

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
