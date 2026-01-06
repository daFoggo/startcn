"use client";
import { SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

interface IDashboardHeaderProps {
  breadcrumbs?: ReactNode;
}

export const DashboardHeader = ({ breadcrumbs }: IDashboardHeaderProps) => {
  const { theme } = useTheme();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2" />
        {breadcrumbs && breadcrumbs}
        <div className="flex items-center gap-2 ml-auto">
          {/* <ThemeTogglerButton
						direction={theme === "light" ? "ltr" : "rtl"}
						variant="ghost"
						size="sm"
					/>
					<Separator
						orientation="vertical"
						className="data-[orientation=vertical]:h-4"
					/>
					<GithubButton /> */}
        </div>
      </div>
    </header>
  );
};
