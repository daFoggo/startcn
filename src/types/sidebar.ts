import type { Icon as TablerIcon } from "@tabler/icons-react";

export interface ISidebarNavigationItem {
	title: string;
	to: string;
	icon?: TablerIcon;
	children?: ISidebarNavigationItem[];
	isActive?: boolean;
	exactActive?: boolean;
	badge?: number | string;
}

export interface ISidebarGroup {
	label?: string;
	items: ISidebarNavigationItem[];
}

export type TSidebarNavigation = ISidebarGroup[];

export type TSidebarContextId = "default" | "project-settings";

export interface ISidebarContextMatch {
	contextId: TSidebarContextId;
	params?: Record<string, string>;
}
