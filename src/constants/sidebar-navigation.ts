import {
	IconCalendarHeart as CalendarHeart,
	IconInbox as Inbox,
	IconLayout2 as LayoutTemplate,
	IconUsers as Users,
} from "@tabler/icons-react";
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

export const resolveSidebarContextFromPathname = (
	_pathname: string,
): ISidebarContextMatch => {
	return {
		contextId: "default",
	};
};
