import {
	Archive,
	Bookmark,
	ChartLine,
	ChartNoAxesGantt,
	Inbox,
	Kanban,
	ListTree,
	Settings,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { IViewModeCatalogItem } from "@/types/view-mode-list";

export const PROJECT_VIEW_MODE_CATALOG: IViewModeCatalogItem[] = [
	{
		value: "dashboard",
		label: "Dashboard",
		icon: ChartLine,
		to: "/dashboard/$teamId/projects/$projectId/dashboard",
		isDefault: true,
		isVisibleByDefault: true,
	},
	{
		value: "list",
		label: "List",
		icon: ListTree,
		to: "/dashboard/$teamId/projects/$projectId/list",
		isVisibleByDefault: true,
	},
	{
		value: "board",
		label: "Board",
		icon: Kanban,
		to: "/dashboard/$teamId/projects/$projectId/board",
		isVisibleByDefault: true,
	},
	{
		value: "timeline",
		label: "Timeline",
		icon: ChartNoAxesGantt,
		to: "/dashboard/$teamId/projects/$projectId/timeline",
		isVisibleByDefault: false,
	},
];

export const INBOX_VIEW_MODE_CATALOG: IViewModeCatalogItem[] = [
	{
		value: "active",
		label: "Active",
		icon: Inbox,
		to: "/dashboard/$teamId/inbox/active",
		isDefault: true,
	},
	{
		value: "bookmarks",
		label: "Bookmarks",
		icon: Bookmark,
		to: "/dashboard/$teamId/inbox/bookmarks",
	},
	{
		value: "archive",
		label: "Archive",
		icon: Archive,
		to: "/dashboard/$teamId/inbox/archive",
	},
];

export const TEAM_VIEW_MODE_CATALOG: IViewModeCatalogItem[] = [
	{
		value: "members",
		label: "Members",
		icon: Users,
		to: "/dashboard/$teamId/team/members",
		isDefault: true,
	},
	{
		value: "settings",
		label: "Settings",
		icon: Settings,
		to: "/dashboard/$teamId/team/settings",
	},
];

export const buildViewModes = <T extends string>(
	catalog: IViewModeCatalogItem[],
	renderers: Record<T, () => ReactNode>,
) =>
	catalog
		.filter((mode) => mode.value in renderers)
		.map((mode) => ({
			value: mode.value,
			label: mode.label,
			icon: mode.icon,
			isDefault: mode.isDefault,
			isVisibleByDefault: mode.isVisibleByDefault,
			badge: mode.badge,
			badgeVariant: mode.badgeVariant,
			render: renderers[mode.value as T],
		}));
