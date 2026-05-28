import type { Icon as TablerIcon } from "@tabler/icons-react";

export interface INavigationItem {
	title: string;
	to: string;
	icon?: TablerIcon;
	children?: INavigationItem[];
	isActive?: boolean;
	exactActive?: boolean;
	badge?: number | string;
}

export interface INavigationGroup {
	label?: string;
	items: INavigationItem[];
}

export type TNavigation = INavigationGroup[];

export type TSidebarContextId = "default" | "team" | "settings";

export interface ISidebarContextMatch {
	contextId: TSidebarContextId;
	params?: Record<string, string>;
}
