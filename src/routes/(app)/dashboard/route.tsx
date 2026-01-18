import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChartPie, User2 } from "lucide-react";
import { DashboardBreadcrumb } from "@/components/layouts/breadcrumb";
import {
	SidebarLayout,
	SidebarSiteHeader,
} from "@/components/layouts/sidebar-layout";
import { SITE_CONFIG } from "@/configs/site";
import type { SidebarNavItem } from "@/types/sidebar";

export const Route = createFileRoute("/(app)/dashboard")({
	staticData: {
		getTitle: () => "Dashboard",
	},
	component: DashboardLayout,
});

function DashboardLayout() {
	const navigation: SidebarNavItem[] = [
		{
			title: "Overview",
			to: "/dashboard/overview",
			icon: ChartPie,
		},
		{
			title: "Users",
			to: "/dashboard/users",
			icon: User2,
		},
	];

	return (
		<SidebarLayout
			navigation={navigation}
			variant="inset"
			header={
				<SidebarSiteHeader
					title={SITE_CONFIG.metadata.title}
					subtitle={SITE_CONFIG.metadata.subTitle}
				/>
			}
		>
			<div className="p-4 space-y-4">
				<DashboardBreadcrumb />
				<Outlet />
			</div>
		</SidebarLayout>
	);
}
