"use client";

import { useEffect, useState } from "react";
import { useSampleModels } from "@/features/chat-models/hooks/use-chat-models";
import { useChatModelBlocksStore } from "@/features/chat-models/stores/chat-model-blocks-store";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { AIChatBlock } from "./components/ai-chat-block";
import { ChatHistoryPanel } from "./components/chat-history-panel";
import { ChatSidebar } from "./components/chat-sidebar";

const ChatModelsPage = () => {
	const { setBreadcrumbs } = useBreadcrumbStore();
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);

	const { blocks, addBlock, updateBlockModel, removeBlock, moveBlockPosition, resetBlock } = useChatModelBlocksStore();

	const { data: models } = useSampleModels();

	useEffect(() => {
		setBreadcrumbs([{ title: "Chat Models", url: "/dashboard/chat-models" }]);
	}, [setBreadcrumbs]);

	useEffect(() => {
		if (models && blocks.length > 0) {
			blocks.forEach((b) => {
				if (!b.selectedModel) {
					updateBlockModel(b.blockId, models[0].value);
				}
			});
		}
	}, [models, blocks, updateBlockModel]);

	return (
		<div className="relative flex w-full h-[calc(100svh-var(--header-height)-var(--spacing)*4)] overflow-hidden">
			{/* Sidebar */}
			<ChatSidebar
				isHistoryOpen={isHistoryOpen}
				setIsHistoryOpen={setIsHistoryOpen}
			/>

			{/* History Panel */}
			<div
				className={[
					"absolute top-0 left-16 h-full z-10 transition-all duration-300",
					isHistoryOpen
						? "translate-x-0 opacity-100 visible pointer-events-auto"
						: "-translate-x-full opacity-0 invisible pointer-events-none",
				].join(" ")}
			>
				<ChatHistoryPanel setIsHistoryOpen={setIsHistoryOpen} />
			</div>

			{/* Main content */}
			<div className="flex-1 p-3 overflow-x-auto overflow-y-hidden">
				<div className="flex gap-3 h-full">
					{blocks.map((b, index) => (
						<div
							key={b.blockId}
							className="shrink-0"
							style={{
								width:
									blocks.length === 1
										? "100%"
										: blocks.length === 2
											? "50%"
											: "max(50%, 600px)",
							}}
						>
							<AIChatBlock
								options={
									models?.map((m) => ({
										label: m.label,
										value: m.value,
										icon: m.icon,
									})) || []
								}
								currentOption={b.selectedModel || undefined}
								onOptionChange={(value) => updateBlockModel(b.blockId, value)}
								onAddBlock={addBlock}
								modelId={b.selectedModel || ""}
								blockId={b.blockId}
								blockIndex={index}
								totalBlocks={blocks.length}
								onRemoveBlock={removeBlock}
								onMoveBlock={moveBlockPosition}
								onResetBlock={resetBlock}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ChatModelsPage;
