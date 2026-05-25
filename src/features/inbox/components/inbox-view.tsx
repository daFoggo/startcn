import { useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInboxStore } from "@/stores/use-inbox-store";
import type { TInboxItem } from "../schemas";
import { InboxDetailPanel } from "./inbox-detail-panel";
import { InboxList } from "./inbox-list";

interface IInboxViewProps {
	items: TInboxItem[];
	isAcceptingInvitation?: boolean;
	onAcceptInvitation?: (item: TInboxItem) => void;
}

export const InboxView = ({
	items,
	isAcceptingInvitation,
	onAcceptInvitation,
}: IInboxViewProps) => {
	const { selectedItemId } = useInboxStore();
	const selectedItem = items.find((item) => item.id === selectedItemId) || null;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="h-full w-full flex flex-col min-h-0">
			{/* Desktop View with Resizable Panels */}
			<div className="hidden lg:flex h-full w-full min-h-0">
				<div className="flex-1 h-full rounded-lg border bg-card overflow-hidden">
					<ResizablePanelGroup
						orientation="horizontal"
						onLayoutChange={(sizes) => {
							document.cookie = `inbox-layout=${JSON.stringify(sizes)};path=/;max-age=31536000`;
						}}
					>
						{/* Left Panel - Inbox List */}
						<ResizablePanel defaultSize="35%" className="overflow-hidden">
							<ScrollArea className="h-full">
								<div className="p-4">
									<InboxList items={items} />
								</div>
							</ScrollArea>
						</ResizablePanel>

						<ResizableHandle withHandle />

						{/* Right Panel - Detail View */}
						<ResizablePanel defaultSize="65%" className="overflow-hidden">
							<InboxDetailPanel
								item={selectedItem}
								isAcceptingInvitation={isAcceptingInvitation}
								onAcceptInvitation={onAcceptInvitation}
							/>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			{/* Mobile View - List Only */}
			<div className="lg:hidden h-full bg-card rounded-lg border overflow-hidden">
				<ScrollArea className="h-full">
					<div className="p-4">
						<InboxList items={items} />
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
