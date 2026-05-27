import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSidebarGroupsForContext } from "@/constants/sidebar-navigation";
import type { TUser } from "@/features/users";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarContextStore } from "@/stores/use-sidebar-context-store";
import { SidebarGroupSection } from "./sidebar-navigation";

export interface IAppSidebarProps {
	currentUser?: TUser;
	isCurrentUserLoading: boolean;
}

export const AppSidebar = ({
	currentUser: _currentUser,
	isCurrentUserLoading: _isCurrentUserLoading,
}: IAppSidebarProps) => {
	const { pathname } = useLocation();
	const isMobile = useIsMobile();
	const syncWithPathname = useSidebarContextStore(
		(state) => state.syncWithPathname,
	);
	const activeContextId = useSidebarContextStore(
		(state) => state.activeContextId,
	);
	const sidebarGroups = getSidebarGroupsForContext(activeContextId);

	useEffect(() => {
		syncWithPathname(pathname);
	}, [pathname, syncWithPathname]);

	return (
		<Sidebar
			side={isMobile ? "right" : "left"}
			variant="sidebar"
			collapsible="icon"
			className="md:top-12 md:h-[calc(100vh-3rem)] border-r  bg-background shrink-0"
		>
			<SidebarContent className="py-2 bg-background">
				{sidebarGroups.map((group) => (
					<SidebarGroupSection key={group.label || "default"} group={group} />
				))}
			</SidebarContent>
			<SidebarFooter className="mt-auto p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<SidebarTrigger className="w-full justify-start" />}
							tooltip="Toggle sidebar"
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
