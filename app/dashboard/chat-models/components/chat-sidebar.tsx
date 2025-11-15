import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Clock4 } from "@/components/animate-ui/icons/clock-4";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Plus } from "@/components/animate-ui/icons/plus";
import { Button } from "@/components/ui/button";

interface IChatSidebarProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
}
export const ChatSidebar = ({
  isHistoryOpen,
  setIsHistoryOpen,
}: IChatSidebarProps) => {
  return (
    <div className="z-20 relative flex flex-col items-center gap-3 bg-background p-3 border-border border-r rounded-bl-xl w-16 shrink-0">
      <Tooltip side="right">
        <AnimateIcon animateOnHover >
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="size-4" />
            </Button>
          </TooltipTrigger>
        </AnimateIcon>
        <TooltipContent>Add new chat</TooltipContent>
      </Tooltip>

      <Tooltip side="right">
        <AnimateIcon animateOnHover >
          <TooltipTrigger asChild>
            <Button
              variant={isHistoryOpen ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <Clock4 className="size-4" />
            </Button>
          </TooltipTrigger>
        </AnimateIcon>
        <TooltipContent>
          {isHistoryOpen ? "Close history" : "Open history"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
