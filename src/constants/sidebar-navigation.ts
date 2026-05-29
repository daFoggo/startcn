import {
	IconFolder,
	IconHomeBolt,
	IconInfoCircle,
	IconSettingsSpark,
	IconTable,
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
			title: "Projects",
			to: "/dashboard/projects",
			icon: IconFolder,
		},
	],
};

const getProjectSidebarGroups = (projectId: string): INavigationGroup[] => [
	{
		items: [
			{
				title: "Dashboard",
				to: `/dashboard/projects/${projectId}/home`,
				icon: IconHomeBolt,
				exactActive: true,
			},
			{
				title: "Configuration",
				to: `/dashboard/projects/${projectId}/setup`,
				icon: IconSettingsSpark,
				exactActive: true,
			},
			{
				title: "Annotation Logs",
				to: `/dashboard/projects/${projectId}/annotation`,
				icon: IconTable,
				exactActive: true,
			},
			{
				title: "About Project",
				to: `/dashboard/projects/${projectId}/about`,
				icon: IconInfoCircle,
				exactActive: true,
			},
		],
	},
];

export const SIDEBAR_GROUPS_BY_CONTEXT: Record<
	TSidebarContextId,
	INavigationGroup[]
> = {
	default: [SIDEBAR_PERSONAL],
	project: [SIDEBAR_PERSONAL],
};

export const getSidebarGroupsForContext = (
	contextId: TSidebarContextId,
	params: Record<string, string> = {},
): INavigationGroup[] => {
	if (contextId === "project" && params.projectId) {
		return getProjectSidebarGroups(params.projectId);
	}

	return (
		SIDEBAR_GROUPS_BY_CONTEXT[contextId] ?? SIDEBAR_GROUPS_BY_CONTEXT.default
	);
};

export const resolveSidebarContextFromPathname = (
	pathname: string,
): ISidebarContextMatch => {
	const projectMatch = pathname.match(/^\/dashboard\/projects\/([^/]+)/);

	if (projectMatch?.[1]) {
		return {
			contextId: "project",
			params: {
				projectId: projectMatch[1],
			},
		};
	}

	return {
		contextId: "default",
	};
};
