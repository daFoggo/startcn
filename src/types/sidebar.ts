import type { LucideIcon } from "lucide-react";

export interface ISidebarNavigationItem {
	title: string;
	to: string;
	icon?: LucideIcon;
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
