import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Clock4 } from "@/components/animate-ui/icons/clock-4";
import { Plus } from "@/components/animate-ui/icons/plus";
import { Button } from "@/components/ui/button";

interface IChatSidebarProps {
  handleAddBlock: () => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
}
export const ChatSidebar = ({
  handleAddBlock,
  isHistoryOpen,
  setIsHistoryOpen,
}: IChatSidebarProps) => {
  return (
    <div className="z-10 relative flex flex-col items-center gap-3 bg-background p-3 border-border border-r w-16 shrink-0">
      <Tooltip side="right">
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleAddBlock}>
            <Plus
              className="size-4"
              animateOnHover
              animateOnView
              animateOnTap
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add new chat</TooltipContent>
      </Tooltip>

      <Tooltip side="right">
        <TooltipTrigger asChild>
          <Button
            variant={isHistoryOpen ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <Clock4
              className="size-4"
              animateOnHover
              animateOnView
              animateOnTap
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isHistoryOpen ? "Close history" : "Open history"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
