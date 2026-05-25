import { useTheme } from "@/components/common/theme-provider";
import { ThemeToggle } from "@/components/common/theme-provider/theme-toggle";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export const ThemeToggleWrapper = () => {
	const { theme } = useTheme();
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<div className="flex w-full items-center justify-between">
					<span className="text-sm font-medium">
						{theme === "dark" ? "Dark" : "Light"} mode
					</span>
					<ThemeToggle />
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
