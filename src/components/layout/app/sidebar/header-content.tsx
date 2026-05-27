import { IconSubtitlesAi } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SITE_CONFIG } from "@/configs/site";

export const HeaderContent = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Link to="/dashboard">
					<SidebarMenuButton>
						<IconSubtitlesAi className="size-5!" />
						<span className="text-lg font-semibold">
							{SITE_CONFIG.app.title}
						</span>
					</SidebarMenuButton>
				</Link>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
