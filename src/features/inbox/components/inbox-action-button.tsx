import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IInboxActionButtonProps {
	icon: any;
	tooltip: string;
	onClick: (e: React.MouseEvent) => void;
	className?: string;
}

export const InboxActionButton = ({
	icon: Icon,
	tooltip,
	onClick,
	className,
}: IInboxActionButtonProps) => (
	<Tooltip>
		<TooltipTrigger asChild>
			<Button
				variant="ghost"
				size="icon-sm"
				className={cn("rounded-md text-muted-foreground", className)}
				onClick={onClick}
			>
				<Icon className="size-3.5" />
			</Button>
		</TooltipTrigger>
		<TooltipContent side="top">{tooltip}</TooltipContent>
	</Tooltip>
);
