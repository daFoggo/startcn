import { IconFolder } from "@tabler/icons-react";
import type {
	INavigationGroup,
	ISidebarContextMatch,
	TSidebarContextId,
} from "@/types/sidebar";

export const SIDEBAR_PERSONAL: INavigationGroup = {
	label: "Personal",
	items: [
		{
			title: "Projects",
			to: "/dashboard/projects",
			icon: IconFolder,
		},
	],
};

export const SIDEBAR_GROUPS_BY_CONTEXT: Record<
	TSidebarContextId,
	INavigationGroup[]
> = {
	default: [SIDEBAR_PERSONAL],
};

export const getSidebarGroupsForContext = (
	contextId: TSidebarContextId,
): INavigationGroup[] => {
	return (
		SIDEBAR_GROUPS_BY_CONTEXT[contextId] ?? SIDEBAR_GROUPS_BY_CONTEXT.default
	);
};

export const resolveSidebarContextFromPathname = (
	_pathname: string,
): ISidebarContextMatch => {
	return {
		contextId: "default",
	};
};
