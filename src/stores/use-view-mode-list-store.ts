import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	IResolvedViewMode,
	IViewModeDefinition,
	IViewModeListStore,
	IViewModeScopeState,
	IViewModeState,
} from "@/types/view-mode-list";

/**
 * Quản lý các state liên quan phần tabs view mode ở trong mỗi layout của các page như team, project, inbox
 * Có khả năng lấy lại view mode user xem trước đó qua storage
 * Có thể dynamic hiển thị một số view mode khi cần, ví dụ settings, members ở trong project
 */
export const useViewModeListStore = create<IViewModeListStore>()(
	persist(
		(set) => ({
			modesByScope: {},
			hasHydrated: false,

			setHasHydrated: (value) =>
				set(() => ({
					hasHydrated: value,
				})),

			setModes: (scope, modes) =>
				set((state) => ({
					modesByScope: {
						...state.modesByScope,
						[scope]: {
							...state.modesByScope[scope],
							modes,
						},
					},
				})),

			toggleModeVisibility: (scope, value, definitions) =>
				set((state) => {
					const scopeState = getScopeState(
						scope,
						definitions,
						state.modesByScope,
					);
					const modes = scopeState.modes.map((mode) => {
						if (mode.value !== value) {
							return mode;
						}

						const nextVisibility = !mode.isVisible;
						if (!nextVisibility) {
							const visibleCount = scopeState.modes.filter(
								(item) => item.isVisible,
							).length;
							if (visibleCount <= 1) {
								return mode;
							}
						}

						return { ...mode, isVisible: nextVisibility };
					});

					return {
						modesByScope: {
							...state.modesByScope,
							[scope]: {
								modes,
								activeValue: scopeState.activeValue,
							},
						},
					};
				}),

			reorderModes: (scope, sourceIndex, targetIndex, definitions) =>
				set((state) => {
					const scopeState = getScopeState(
						scope,
						definitions,
						state.modesByScope,
					);
					const modes = [...scopeState.modes];
					const [removed] = modes.splice(sourceIndex, 1);
					modes.splice(targetIndex, 0, removed);

					return {
						modesByScope: {
							...state.modesByScope,
							[scope]: {
								modes,
								activeValue: scopeState.activeValue,
							},
						},
					};
				}),

			updateMode: (scope, value, updates, definitions) =>
				set((state) => {
					const scopeState = getScopeState(
						scope,
						definitions,
						state.modesByScope,
					);
					const modes = scopeState.modes.map((mode) =>
						mode.value === value ? { ...mode, ...updates } : mode,
					);

					return {
						modesByScope: {
							...state.modesByScope,
							[scope]: {
								modes,
								activeValue: scopeState.activeValue,
							},
						},
					};
				}),

			updateModeMetadata: (scope, value, metadata) =>
				set((state) => {
					const scopeState = state.modesByScope[scope];
					if (!scopeState) return state;

					const modes = scopeState.modes.map((mode) =>
						mode.value === value
							? { ...mode, metadata: { ...mode.metadata, ...metadata } }
							: mode,
					);

					return {
						modesByScope: {
							...state.modesByScope,
							[scope]: {
								...scopeState,
								modes,
							},
						},
					};
				}),

			setActiveMode: (scope, value) =>
				set((state) => ({
					modesByScope: {
						...state.modesByScope,
						[scope]: {
							...state.modesByScope[scope],
							activeValue: value,
						},
					},
				})),

			resetToDefault: (scope) =>
				set((state) => {
					const nextState = { ...state.modesByScope };
					delete nextState[scope];

					return {
						modesByScope: nextState,
					};
				}),

			resetAll: () =>
				set(() => ({
					modesByScope: {},
				})),
		}),
		{
			name: "view-mode-list-storage",
			version: 1,
			// Chỉ lưu phần user đã chỉnh. Phần còn lại sẽ được tạo lại khi mở app.
			partialize: (state) => ({
				modesByScope: state.modesByScope,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);

export const useViewModeListHydrated = () =>
	useViewModeListStore((state) => state.hasHydrated);

const buildDefaultModeStates = (
	definitions: IViewModeDefinition[],
): IViewModeState[] =>
	definitions.map((item, index) => ({
		value: item.value,
		label: item.label,
		isDefault: item.isDefault ?? index === 0,
		isVisible: item.isVisibleByDefault ?? true,
	}));

export const resolveViewModes = (
	definitions: IViewModeDefinition[],
	scopeState?: IViewModeScopeState,
): { modes: IResolvedViewMode[]; activeValue?: string } => {
	if (definitions.length === 0) {
		return { modes: [] };
	}

	const defaultModes = buildDefaultModeStates(definitions);
	const mergedModes: IResolvedViewMode[] = (scopeState?.modes ?? defaultModes)
		.map((savedMode) => {
			const definition = definitions.find(
				(item) => item.value === savedMode.value,
			);
			if (!definition) return null;

			return {
				value: savedMode.value,
				label: savedMode.label ?? definition.label,
				isDefault: savedMode.isDefault,
				isVisible: savedMode.isVisible,
				metadata: savedMode.metadata,
				icon: definition.icon,
				render: definition.render,
				badge: definition.badge,
				badgeVariant: definition.badgeVariant,
			} as IResolvedViewMode;
		})
		.filter((mode): mode is IResolvedViewMode => mode !== null);

	const seenValues = new Set(mergedModes.map((mode) => mode.value));
	const missingModes = definitions
		.filter((definition) => !seenValues.has(definition.value))
		.map((definition, index) => ({
			value: definition.value,
			label: definition.label,
			icon: definition.icon,
			render: definition.render,
			isDefault:
				definition.isDefault ?? (mergedModes.length === 0 && index === 0),
			isVisible: definition.isVisibleByDefault ?? true,
			badge: definition.badge,
			badgeVariant: definition.badgeVariant,
		}));

	const modes = [...mergedModes, ...missingModes];
	const visibleModes = modes.filter((mode) => mode.isVisible);
	const activeValueIsVisible = visibleModes.some(
		(mode) => mode.value === scopeState?.activeValue,
	);

	const activeValue = activeValueIsVisible
		? scopeState?.activeValue
		: (visibleModes.find((mode) => mode.isDefault)?.value ??
			visibleModes[0]?.value);

	return {
		modes,
		activeValue,
	};
};

const getScopeState = (
	scope: string,
	definitions: IViewModeDefinition[],
	modesByScope: Record<string, IViewModeScopeState>,
) => {
	const resolved = resolveViewModes(definitions, modesByScope[scope]);
	return {
		modes: resolved.modes.map(({ icon, render, ...rest }) => rest),
		activeValue: resolved.activeValue,
	};
};
