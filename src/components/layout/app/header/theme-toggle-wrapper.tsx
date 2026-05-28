import { useTheme } from "@/components/common/theme-provider";
import { ThemeToggle } from "@/components/common/theme-provider/theme-toggle";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export const ThemeToggleWrapper = () => {
	const { theme, resolvedTheme } = useTheme();
	const label =
		theme === "system"
			? "System mode"
			: `${resolvedTheme === "dark" ? "Dark" : "Light"} mode`;
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				render={<div className="flex w-full items-center justify-between" />}
			>
				<span className="text-sm font-medium">{label}</span>
				<ThemeToggle />
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
