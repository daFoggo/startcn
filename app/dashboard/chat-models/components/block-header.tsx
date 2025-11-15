"use client";

import {
	RotateCcwSquare,
	SquareArrowLeft,
	SquareArrowRight,
	SquareX,
} from "lucide-react";
import { createElement } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Ellipsis } from "@/components/animate-ui/icons/ellipsis";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { SlidersHorizontal } from "@/components/animate-ui/icons/sliders-horizontal";
import { SquarePlus } from "@/components/animate-ui/icons/square-plus";
import type { ComboBoxOption } from "@/components/common/combo-box";
import { ComboBox } from "@/components/common/combo-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IBlockHeaderProps {
	options?: ComboBoxOption[];
	currentOption?: string;
	onOptionChange?: (value: string) => void;
	onAddBlock?: () => void;
}

export const BlockHeader = ({
	options = [],
	currentOption,
	onOptionChange,
	onAddBlock,
}: IBlockHeaderProps) => {
	return (
		<div className="flex justify-between items-center gap-2 bg-background p-3 border-b rounded-t-xl w-full overflow-auto">
			<ComboBox
				options={options}
				value={currentOption}
				onValueChange={onOptionChange}
				searchPlaceholder="Search models..."
				emptyText="No models found."
				size="sm"
				renderOption={(option) => {
					return (
						<div className="flex items-center gap-2">
							{option.icon ? (
								createElement(option.icon, { className: "size-4" })
							) : (
								<Avatar>
									<AvatarImage src="" alt={`@${option.value}`} />
									<AvatarFallback className="bg-muted-foreground text-secondary">
										LR
									</AvatarFallback>
								</Avatar>
							)}
							<span className="flex-1">{option.label}</span>
						</div>
					);
				}}
			/>

			<div className="flex items-center gap-2">
				<Tooltip side="bottom">
					<AnimateIcon  animateOnHover>
						<TooltipTrigger>
							<Button size="icon-sm" variant="ghost">
								<SlidersHorizontal className="size-4" />
							</Button>
						</TooltipTrigger>
					</AnimateIcon>
					<TooltipContent>Config model</TooltipContent>
				</Tooltip>
				{onAddBlock && (
					<Tooltip side="bottom">
						<AnimateIcon  animateOnHover>
							<TooltipTrigger>
								<Button size="icon-sm" variant="ghost" onClick={onAddBlock}>
									<SquarePlus className="size-4" />
								</Button>
							</TooltipTrigger>
						</AnimateIcon>
						<TooltipContent>Add model for comparison</TooltipContent>
					</Tooltip>
				)}

				<DropdownMenu>
					<AnimateIcon  animateOnHover>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<Ellipsis className="size-4" />
							</Button>
						</DropdownMenuTrigger>
					</AnimateIcon>
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
	);
};
