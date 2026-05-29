import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { INavigationGroup } from "@/types/sidebar";
import { SidebarGroupSection } from "./sidebar-navigation";

export interface IAppSidebarProps {
	groups: INavigationGroup[];
	isLoading?: boolean;
	side?: "left" | "right";
	showDesktopToggle?: boolean;
}

export const AppSidebar = ({
	groups,
	isLoading = false,
	side = "left",
	showDesktopToggle = true,
}: IAppSidebarProps) => {
	return (
		<Sidebar
			side={side}
			variant="sidebar"
			collapsible="icon"
			className="shrink-0 border-r bg-background md:top-12 md:h-[calc(100vh-3rem)]"
		>
			<SidebarContent className="bg-background py-2">
				{isLoading ? (
					<SidebarMenuSkeletonList />
				) : (
					groups.map((group) => (
						<SidebarGroupSection key={group.label || "default"} group={group} />
					))
				)}
			</SidebarContent>
			{showDesktopToggle && (
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
			)}
		</Sidebar>
	);
};

function SidebarMenuSkeletonList() {
	return (
		<div className="flex flex-col gap-1 p-2">
			<SidebarMenuSkeleton showIcon />
			<SidebarMenuSkeleton showIcon />
			<SidebarMenuSkeleton showIcon />
			<SidebarMenuSkeleton showIcon />
		</div>
	);
}
