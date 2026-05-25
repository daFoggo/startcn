import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface IViewModeCatalogItem {
	value: string;
	label: string;
	icon: LucideIcon;
	to?: string;
	isDefault?: boolean;
	isVisibleByDefault?: boolean;
	badge?: string | number | ReactNode;
	badgeVariant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "ghost"
		| "link";
}

export interface IViewModeDefinition {
	value: string;
	label: string;
	icon: LucideIcon;
	render: () => ReactNode;
	isDefault?: boolean;
	isVisibleByDefault?: boolean;
	badge?: string | number | ReactNode;
	badgeVariant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "ghost"
		| "link";
}

export interface IViewModeState {
	value: string;
	label: string;
	isDefault?: boolean;
	isVisible: boolean;
	metadata?: Record<string, unknown>;
}

export interface IResolvedViewMode extends IViewModeState {
	icon: LucideIcon;
	render: () => ReactNode;
	badge?: string | number | ReactNode;
	badgeVariant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "ghost"
		| "link";
}

export interface IViewModeListStore {
	modesByScope: Record<string, IViewModeScopeState>;
	hasHydrated: boolean;
	setHasHydrated: (value: boolean) => void;
	setModes: (scope: string, modes: IViewModeState[]) => void;
	toggleModeVisibility: (
		scope: string,
		value: string,
		definitions: IViewModeDefinition[],
	) => void;
	reorderModes: (
		scope: string,
		sourceIndex: number,
		targetIndex: number,
		definitions: IViewModeDefinition[],
	) => void;
	updateMode: (
		scope: string,
		value: string,
		updates: Partial<IViewModeState>,
		definitions: IViewModeDefinition[],
	) => void;
	updateModeMetadata: (
		scope: string,
		value: string,
		metadata: Record<string, unknown>,
	) => void;
	setActiveMode: (scope: string, value: string) => void;
	resetToDefault: (scope: string) => void;
	resetAll: () => void;
}

export interface IViewModeScopeState {
	modes: IViewModeState[];
	activeValue?: string;
}
