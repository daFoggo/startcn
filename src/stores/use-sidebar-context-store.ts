import { create } from "zustand";
import { resolveSidebarContextFromPathname } from "@/constants/sidebar-navigation";
import type { TSidebarContextId } from "@/types/sidebar";

interface ISidebarContextStore {
	activeContextId: TSidebarContextId;
	routeParams: Record<string, string>;
	syncWithPathname: (pathname: string) => void;
	reset: () => void;
}

export const useSidebarContextStore = create<ISidebarContextStore>()((set) => ({
	activeContextId: "default",
	routeParams: {},
	syncWithPathname: (pathname) => {
		const resolved = resolveSidebarContextFromPathname(pathname);
		set(() => ({
			activeContextId: resolved.contextId,
			routeParams: resolved.params ?? {},
		}));
	},
	reset: () => {
		set(() => ({
			activeContextId: "default",
			routeParams: {},
		}));
	},
}));
