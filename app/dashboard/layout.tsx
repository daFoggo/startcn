"use client";

import { ChartSplineIcon } from "@/components/animate-ui/icons/chart-spline";
import { GalleryVerticalEnd } from "@/components/animate-ui/icons/gallery-horizontal-end";
import { List } from "@/components/animate-ui/icons/list";
import { MessageSquareHeart } from "@/components/animate-ui/icons/message-square-heart";
import { SparklesIcon } from "@/components/animate-ui/icons/sparkles";
import {
  SidebarLayout,
  SidebarSiteHeader,
  SidebarUserMenu,
} from "@/components/layouts/sidebar-layout";
import { SITE_CONFIG } from "@/configs/site";
import type { ISidebarNavItem } from "@/lib/types/sidebar";
import { DashboardHeader } from "./components/dashboard-header";

const USER = {
  name: "Foggo",
  email: "foggo@example.com",
  avatar: "",
};

const NAVIGATION: ISidebarNavItem[] = [
  {
    title: "Overview",
    url: "/dashboard/overview",
    icon: ChartSplineIcon,
  },
  {
    title: "Chat Models",
    url: "/dashboard/chat-models",
    icon: SparklesIcon,
  },
  {
    title: "Logs",
    url: "/dashboard/logs",
    icon: List,
  },
  {
    title: "Feedbacks",
    url: "/dashboard/feedbacks",
    icon: MessageSquareHeart,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      navigation={NAVIGATION}
      header={
        <SidebarSiteHeader
          logo={
            <GalleryVerticalEnd
              animateOnView
              animateOnHover
              className="size-4"
            />
          }
          title={SITE_CONFIG.name}
        />
      }
      footer={
        <SidebarUserMenu user={USER} onLogout={() => console.log("Logout")} />
      }
    >
      <DashboardHeader />
      <div className="p-6 w-full h-full">{children}</div>
    </SidebarLayout>
  );
}
