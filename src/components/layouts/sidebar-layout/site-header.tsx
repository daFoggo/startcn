import { LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

type SidebarSiteHeaderProps = {
	logo?: ReactNode;
	title: string;
	subtitle?: string;
};

export const SidebarSiteHeader = ({
	logo,
	title,
	subtitle,
}: SidebarSiteHeaderProps) => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
						{logo ? logo : <LayoutDashboard className="size-4" />}
					</div>
					<div className="flex-1 grid text-sm text-left leading-tight">
						<span
							className={`${!subtitle ? "text-xl" : ""} font-semibold truncate`}
						>
							{title}
						</span>
						{subtitle && <span className="text-xs truncate">{subtitle}</span>}
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
