import { nanoid } from "nanoid";
import { create } from "zustand";

export interface IChatBlock {
  blockId: string;
  selectedModel: string | null;
}

interface IChatModelBlockState {
  blocks: IChatBlock[];

  addBlock: () => void;
  removeBlock: (blockId: string) => void;
  updateBlockModel: (blockId: string, model: string) => void; 
  resetBlock: (blockId: string) => void;
  moveBlockPosition: (fromIndex: number, toIndex: number) => void;
}

export const useChatModelBlocksStore = create<IChatModelBlockState>((set, get) => ({
  blocks: [{ blockId: nanoid(), selectedModel: null }],

  addBlock: () =>
    set((state) => ({
      blocks: [...state.blocks, { blockId: nanoid(), selectedModel: null }],
    })),

  removeBlock: (blockId) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.blockId !== blockId),
    })),

  updateBlockModel: (blockId, model) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.blockId === blockId ? { ...b, selectedModel: model } : b
      ),
    })),

  resetBlock: (blockId) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.blockId === blockId ? { ...b, selectedModel: null } : b
      ),
    })),

  moveBlockPosition: (fromIndex, toIndex) =>
    set((state) => {
      const updated = [...state.blocks];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { blocks: updated };
    }),
}));
