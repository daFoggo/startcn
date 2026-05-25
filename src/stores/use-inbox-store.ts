import { create } from "zustand";

interface IInboxStore {
	selectedItemId: string | null;
	setSelectedItemId: (id: string | null) => void;
	clearSelection: () => void;
}

export const useInboxStore = create<IInboxStore>((set) => ({
	selectedItemId: null,
	setSelectedItemId: (id: string | null) => set({ selectedItemId: id }),
	clearSelection: () => set({ selectedItemId: null }),
}));
