/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Check } from "lucide-react";
import {
	type ComponentType,
	createElement,
	type ReactNode,
	useLayoutEffect,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export type ComboBoxOption = {
	value: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
};

export interface IComboBoxProps {
	options: ComboBoxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	searchPlaceholder?: string;
	className?: string;
	triggerClassName?: string;
	contentClassName?: string;
	disabled?: boolean;
	breakpoint?: number;
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
	size?:
		| "default"
		| "icon"
		| "sm"
		| "lg"
		| "icon-sm"
		| "icon-lg"
		| null
		| undefined;
	showCheck?: boolean;
	renderOption?: (option: ComboBoxOption) => ReactNode;
}

interface OptionsListProps {
	options: ComboBoxOption[];
	value?: string;
	searchPlaceholder: string;
	emptyText: string;
	showCheck: boolean;
	renderOption?: (option: ComboBoxOption) => ReactNode;
	onSelect: (value: string) => void;
}

const OptionsList = ({
	options,
	value,
	searchPlaceholder,
	emptyText,
	showCheck,
	renderOption,
	onSelect,
}: OptionsListProps) => {
	return (
		<Command>
			<CommandInput placeholder={searchPlaceholder} />
			<CommandList>
				<CommandEmpty>{emptyText}</CommandEmpty>
				<CommandGroup>
					{options.map((option) => (
						<CommandItem
							key={option.value}
							value={option.value}
							onSelect={onSelect}
						>
							{renderOption ? (
								renderOption(option)
							) : (
								<>
									{option.icon && (
										<span className="mr-2">
											{createElement(option.icon, { className: "size-4" })}
										</span>
									)}

									<span className="flex-1">{option.label}</span>
									{showCheck && value === option.value && (
										<Check className="ml-2 size-4" />
									)}
								</>
							)}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export const ComboBox = ({
	options,
	value,
	onValueChange,
	placeholder = "Select an option...",
	emptyText = "No results found.",
	searchPlaceholder = "Search...",
	className,
	triggerClassName,
	contentClassName,
	disabled = false,
	breakpoint = 768,
	align = "start",
	side = "bottom",
	size = "default",
	showCheck = true,
	renderOption,
}: IComboBoxProps) => {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	// detect desktop
	const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`);

	useLayoutEffect(() => {
		setMounted(true);
	}, []);

	const selectedOption = options.find((option) => option.value === value);

	const handleSelect = (selectedValue: string) => {
		onValueChange?.(selectedValue === value ? "" : selectedValue);
		setOpen(false);
	};

	if (!mounted) {
		return (
			<div className={className}>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn("justify-between", triggerClassName)}
					size={size}
				>
					{selectedOption ? selectedOption.label : placeholder}
				</Button>
			</div>
		);
	}

	// Desktop: Popover
	if (isDesktop) {
		return (
			<div className={className}>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className={cn("justify-between", triggerClassName)}
							size={size}
						>
							{selectedOption ? (
								<span className="flex items-center">
									{selectedOption.icon && (
										<span className="mr-2">
											{createElement(selectedOption.icon, {
												className: "size-4",
											})}
										</span>
									)}
									{selectedOption.label}
								</span>
							) : (
								placeholder
							)}
						</Button>
					</PopoverTrigger>

					<PopoverContent
						className={cn("p-0 w-[200px]", contentClassName)}
						align={align}
						side={side}
					>
						<OptionsList
							options={options}
							value={value}
							searchPlaceholder={searchPlaceholder}
							emptyText={emptyText}
							showCheck={showCheck}
							renderOption={renderOption}
							onSelect={handleSelect}
						/>
					</PopoverContent>
				</Popover>
			</div>
		);
	}

	// Mobile: Drawer
	return (
		<div className={className}>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button
						variant="outline"
						disabled={disabled}
						className={cn("justify-between", triggerClassName)}
						size={size}
					>
						{selectedOption ? (
							<span className="flex items-center">
								{selectedOption.icon && (
									<span className="mr-2">
										{createElement(selectedOption.icon, {
											className: "size-4",
										})}
									</span>
								)}
								{selectedOption.label}
							</span>
						) : (
							placeholder
						)}
					</Button>
				</DrawerTrigger>

				<DrawerContent>
					<div className="mt-4 border-t">
						<OptionsList
							options={options}
							value={value}
							searchPlaceholder={searchPlaceholder}
							emptyText={emptyText}
							showCheck={showCheck}
							renderOption={renderOption}
							onSelect={handleSelect}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
