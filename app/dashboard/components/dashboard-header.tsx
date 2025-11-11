"use client";
import { useTheme } from "next-themes";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";
import { GithubButton } from "@/components/common/github-button";
import { Separator } from "@/components/ui/separator";

export const DashboardHeader = () => {
	const { theme } = useTheme();
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 w-full">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="font-medium text-base">Documents</h1>
				<div className="flex items-center gap-2 ml-auto">
					<ThemeTogglerButton direction={theme === "light" ? "ltr" : "rtl"} variant="ghost" size="sm" />
					<GithubButton />
				</div>
			</div>
		</header>
	);
};
