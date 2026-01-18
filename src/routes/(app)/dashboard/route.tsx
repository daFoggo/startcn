import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChartPie } from "lucide-react";
import {
	SidebarLayout,
	SidebarSiteHeader,
} from "@/components/layouts/sidebar-layout";
import { SITE_CONFIG } from "@/configs/site";
import type { SidebarNavItem } from "@/types/sidebar";

export const Route = createFileRoute("/(app)/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const navigation: SidebarNavItem[] = [
		{
			title: "Overview",
			url: "/overview",
			icon: ChartPie,
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
			<Outlet />
		</SidebarLayout>
	);
}
