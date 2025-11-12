"use client";

import { useEffect, useState } from "react";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { ChatHistoryPanel } from "./components/chat-history-panel";
import { ChatSidebar } from "./components/chat-sidebar";

const ChatModelsPage = () => {
	const { setBreadcrumbs } = useBreadcrumbStore();
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [chatBlocks, setChatBlocks] = useState([{ id: 1 }]);

	useEffect(() => {
		setBreadcrumbs([{ title: "Chat Models", url: "/dashboard/chat-models" }]);
	}, [setBreadcrumbs]);

	const handleAddBlock = () => {
		const newId = Math.max(...chatBlocks.map((b) => b.id), 0) + 1;
		setChatBlocks([...chatBlocks, { id: newId }]);
	};

	return (
		<div className="relative flex w-full h-[calc(100svh-var(--header-height)-var(--spacing)*4)] overflow-hidden">
			{/* Sidebar */}
			<ChatSidebar
				isHistoryOpen={isHistoryOpen}
				setIsHistoryOpen={setIsHistoryOpen}
				handleAddBlock={handleAddBlock}
			/>

			{/* History Panel */}
			<div
				className={[
					"absolute top-0 left-16 h-full z-0",
					"transition-transform duration-300",
					isHistoryOpen
						? "translate-x-0"
						: "-translate-x-full pointer-events-none",
				].join(" ")}
			>
				<ChatHistoryPanel setIsHistoryOpen={setIsHistoryOpen} />
			</div>

			{/* Main content */}
			<div className="flex-1 bg-background" />
		</div>
	);
};

export default ChatModelsPage;
