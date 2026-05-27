import {
	CalendarHeart,
	ChevronLeft,
	CircleDashed,
	Form,
	Inbox,
	LayoutTemplate,
	Users,
} from "lucide-react";
import type { ISidebarContextMatch, ISidebarGroup } from "@/types/sidebar";

export const SIDEBAR_PERSONAL: ISidebarGroup = {
	label: "Personal",
	items: [
		{
			title: "Overview",
			to: "/dashboard/overview",
			icon: LayoutTemplate,
		},
		{
			title: "Schedules",
			to: "/dashboard/schedules",
			icon: CalendarHeart,
		},
		{
			title: "Inbox",
			to: "/dashboard/inbox",
			icon: Inbox,
		},
	],
};

export const SIDEBAR_TEAM: ISidebarGroup = {
	label: "Teams",
	items: [
		{
			title: "My Team",
			to: "/dashboard/team",
			icon: Users,
		},
	],
};

export const SIDEBAR_NAVIGATION: ISidebarGroup[] = [
	SIDEBAR_PERSONAL,
	SIDEBAR_TEAM,
];

export const SIDEBAR_SETTINGS_MENU: ISidebarGroup = {
	label: "System Settings",
	items: [
		{
			title: "Back to Dashboard",
			to: "/dashboard/overview",
			icon: ChevronLeft,
		},
		{
			title: "General Settings",
			to: "/dashboard/settings/general",
			icon: Form,
			exactActive: true,
		},
		{
			title: "Security & Privacy",
			to: "/dashboard/settings/security",
			icon: Users,
			exactActive: true,
		},
		{
			title: "Theme Preference",
			to: "/dashboard/settings/theme",
			icon: CircleDashed,
			exactActive: true,
		},
	],
};

const SETTINGS_PATH_REGEX = /^\/dashboard\/settings(?:\/.*)?\/?$/;

export const resolveSidebarContextFromPathname = (
	pathname: string,
): ISidebarContextMatch => {
	const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

	if (normalizedPathname.match(SETTINGS_PATH_REGEX)) {
		return {
			contextId: "settings",
		};
	}

	return {
		contextId: "default",
	};
};
