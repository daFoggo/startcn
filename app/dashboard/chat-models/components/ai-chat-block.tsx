import {
	RotateCcwSquare,
	SquareArrowLeft,
	SquareArrowRight,
	SquareX,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Ellipsis } from "@/components/animate-ui/icons/ellipsis";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { SlidersHorizontal } from "@/components/animate-ui/icons/sliders-horizontal";
import { SquarePlus } from "@/components/animate-ui/icons/square-plus";
import { ComboBox, type ComboBoxOption } from "@/components/common/combo-box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IAIChatBlockProps {
	options?: ComboBoxOption[];
	currentOption?: string;
	onOptionChange?: (value: string) => void;
	onAddBlock?: () => void;
}

export const AIChatBlock = ({
	options = [],
	currentOption,
	onOptionChange,
	onAddBlock,
}: IAIChatBlockProps) => {
	return (
		<Card className="p-0 h-full">
			<div className="flex justify-between items-center gap-2 bg-background p-3 border-b rounded-t-xl w-full overflow-auto">
				<ComboBox
					options={options}
					value={currentOption}
					onValueChange={onOptionChange}
					searchPlaceholder="Search models..."
					emptyText="No models found."
					size="sm"
				/>

				<div className="flex items-center gap-2">
					<Tooltip side="bottom">
						<TooltipTrigger>
							<Button size="icon-sm" variant="ghost" onClick={onAddBlock}>
								<AnimateIcon animateOnView animateOnHover>
									<SlidersHorizontal className="size-4" />
								</AnimateIcon>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Config model</TooltipContent>
					</Tooltip>
					{onAddBlock && (
						<Tooltip side="bottom">
							<TooltipTrigger>
								<Button size="icon-sm" variant="ghost" onClick={onAddBlock}>
									<AnimateIcon animateOnView animateOnHover>
										<SquarePlus className="size-4" />
									</AnimateIcon>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Add model for comparison</TooltipContent>
						</Tooltip>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<AnimateIcon animateOnView animateOnHover>
									<Ellipsis className="size-4" />
								</AnimateIcon>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<RotateCcwSquare className="mr-2 size-4" />
									Clear chat
								</DropdownMenuItem>
								<DropdownMenuItem>
									<SquareArrowLeft className="mr-2 size-4" />
									Move left
								</DropdownMenuItem>
								<DropdownMenuItem>
									<SquareArrowRight className="mr-2 size-4" />
									Move right
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<SquareX className="mr-2 size-4 text-destructive" />
								<span className="text-destructive">Delete model</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</Card>
	);
};
