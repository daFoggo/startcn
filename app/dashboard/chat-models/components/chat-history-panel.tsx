"use client";

import { PanelRightOpen } from "@/components/animate-ui/icons/panel-right-open";
import { Trash2 } from "@/components/animate-ui/icons/trash-2";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockChatData = [
  {
    title: "Today",
    chats: [
      "Build new landing page",
      "amongus in da cactus",
      "Design review notes",
    ],
  },
  {
    title: "Yesterday",
    chats: ["Fix auth bug", "Team sync summary"],
  },
  {
    title: "Earlier this week",
    chats: ["Meeting with marketing", "Deploy checklist"],
  },
];

interface IChatHistoryPanelProps {
  setIsHistoryOpen: (isOpen: boolean) => void;
}

export const ChatHistoryPanel = ({ setIsHistoryOpen }: IChatHistoryPanelProps) => {
  return (
    <div className="relative flex flex-col bg-background border-border border-r w-64 sm:w-80 h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border-border border-b shrink-0">
        <p className="font-semibold">History</p>
        <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
          <PanelRightOpen
            className="size-4"
            animateOnHover
            animateOnView
            
          />
        </Button>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-6 px-6 py-3">
          {mockChatData.map((group) => (
            <div key={group.title}>
              <p className="mb-2 ml-3 font-medium text-muted-foreground text-xs">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.chats.map((chat) => (
                  <div
                    key={chat}
                    className="group flex justify-between items-center hover:bg-muted px-3 py-2 rounded-lg text-sm transition-colors duration-300 cursor-pointer"
                  >
                    <span className="font-medium truncate">{chat}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Trash2
                        animateOnHover
                        animateOnView
                        
                        className="size-4 text-muted-foreground hover:text-destructive"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
