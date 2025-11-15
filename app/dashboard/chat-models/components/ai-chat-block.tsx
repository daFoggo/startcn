"use client";

import type { ComboBoxOption } from "@/components/common/combo-box";
import { Card } from "@/components/ui/card";
import { BlockConversation } from "./block-conversation";
import { BlockHeader } from "./block-header";
import { BlockPromptInput } from "./block-prompt-input";

interface IAIChatBlockProps {
  options?: ComboBoxOption[];
  currentOption?: string;
  onOptionChange?: (value: string) => void;
  onAddBlock?: () => void;
  modelId: string;
  blockId: string;
  blockIndex: number;
  totalBlocks: number;
  onRemoveBlock: (blockId: string) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
  onResetBlock: (blockId: string) => void;
}

export const AIChatBlock = ({
  options = [],
  currentOption,
  onOptionChange,
  onAddBlock,
  modelId,
  blockId,
  blockIndex,
  totalBlocks,
  onRemoveBlock,
  onMoveBlock,
  onResetBlock,
}: IAIChatBlockProps) => {
  return (
    <Card className="flex flex-col gap-0 p-0 h-full">
      <BlockHeader
        options={options}
        currentOption={currentOption}
        onOptionChange={onOptionChange}
        onAddBlock={onAddBlock}
        blockId={blockId}
        blockIndex={blockIndex}
        totalBlocks={totalBlocks}
        onRemoveBlock={onRemoveBlock}
        onMoveBlock={onMoveBlock}
        onResetBlock={onResetBlock}
      />

      <BlockConversation />

      <BlockPromptInput modelId={modelId} />
    </Card>
  );
};