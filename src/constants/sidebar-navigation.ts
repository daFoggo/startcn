import {
	IconCalendarHeart as CalendarHeart,
	IconAdjustments,
	IconCreditCard,
	IconLock,
	IconUser,
	IconUserPlus,
	IconInbox as Inbox,
	IconLayout2 as LayoutTemplate,
	IconUsers as Users,
} from "@tabler/icons-react";
import type {
	INavigationGroup,
	ISidebarContextMatch,
	TSidebarContextId,
} from "@/types/sidebar";

export const SIDEBAR_PERSONAL: INavigationGroup = {
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

export const SIDEBAR_TEAM: INavigationGroup = {
	label: "Teams",
	items: [
		{
			title: "My Team",
			to: "/dashboard/team",
			icon: Users,
		},
	],
};

export const SIDEBAR_SETTINGS: INavigationGroup = {
	label: "Settings",
	items: [
		{
			title: "Profile",
			to: "/dashboard/settings",
			icon: IconUser,
			exactActive: true,
		},
		{
			title: "Security",
			to: "/dashboard/settings/security",
			icon: IconLock,
		},
		{
			title: "Preferences",
			to: "/dashboard/settings/preferences",
			icon: IconAdjustments,
		},
		{
			title: "Billing",
			to: "/dashboard/settings/billing",
			icon: IconCreditCard,
		},
	],
};

export const SIDEBAR_TEAM_CONTEXT: INavigationGroup = {
	label: "Team Tools",
	items: [
		{
			title: "Overview",
			to: "/dashboard/team",
			icon: Users,
			exactActive: true,
		},
		{
			title: "Members",
			to: "/dashboard/team/members",
			icon: IconUserPlus,
		},
		{
			title: "Configurations",
			to: "/dashboard/team/configurations",
			icon: IconAdjustments,
		},
	],
};

export const SIDEBAR_GROUPS_BY_CONTEXT: Record<
	TSidebarContextId,
	INavigationGroup[]
> = {
	default: [SIDEBAR_PERSONAL, SIDEBAR_TEAM, SIDEBAR_SETTINGS],
	team: [SIDEBAR_TEAM_CONTEXT, SIDEBAR_SETTINGS],
	settings: [SIDEBAR_SETTINGS],
};

export const getSidebarGroupsForContext = (
	contextId: TSidebarContextId,
): INavigationGroup[] => {
	return (
		SIDEBAR_GROUPS_BY_CONTEXT[contextId] ?? SIDEBAR_GROUPS_BY_CONTEXT.default
	);
};

export const resolveSidebarContextFromPathname = (
	pathname: string,
): ISidebarContextMatch => {
	if (pathname.startsWith("/dashboard/settings")) {
		return {
			contextId: "settings",
		};
	}

	const teamContextMatch = pathname.match(/^\/dashboard\/([^/]+)$/);
	if (teamContextMatch) {
		const [, teamId] = teamContextMatch;
		if (
			!teamId ||
			["overview", "schedules", "inbox", "team"].includes(teamId)
		) {
			return {
				contextId: "default",
			};
		}

		return {
			contextId: "team",
			params: {
				teamId,
			},
		};
	}

	if (
		pathname.startsWith("/dashboard/team") ||
		(/^\/dashboard\/[^/]+$/.test(pathname) &&
			!pathname.endsWith("/overview") &&
			!pathname.endsWith("/schedules") &&
			!pathname.endsWith("/inbox"))
	) {
		return {
			contextId: "team",
		};
	}
	return {
		contextId: "default",
	};
};
