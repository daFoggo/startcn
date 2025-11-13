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

	const { blocks, addBlock, updateBlockModel } = useChatModelBlocksStore();

	const { data: models } = useSampleModels();

	useEffect(() => {
		setBreadcrumbs([{ title: "Chat Models", url: "/dashboard/chat-models" }]);
	}, [setBreadcrumbs]);

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
					"absolute top-0 left-16 h-full z-0 transition-all duration-300",
					isHistoryOpen
						? "translate-x-0 opacity-100 visible pointer-events-auto"
						: "-translate-x-full opacity-0 invisible pointer-events-none",
				].join(" ")}
			>
				<ChatHistoryPanel setIsHistoryOpen={setIsHistoryOpen} />
			</div>

			{/* Main content */}
			<div className="flex-1 space-y-3 p-3 overflow-auto">
				{blocks.map((b) => (
					<AIChatBlock
						key={b.blockId}
						options={models?.map((m) => ({ label: m.label, value: m.value })) || []}
						currentOption={b.selectedModel || undefined}
						onOptionChange={(value) => updateBlockModel(b.blockId, value)}
						onAddBlock={addBlock}
					/>
				))}
			</div>
		</div>
	);
};

export default ChatModelsPage;
