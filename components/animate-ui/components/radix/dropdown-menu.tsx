import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import {
	DropdownMenuCheckboxItem as DropdownMenuCheckboxItemPrimitive,
	type DropdownMenuCheckboxItemProps as DropdownMenuCheckboxItemPrimitiveProps,
	DropdownMenuContent as DropdownMenuContentPrimitive,
	type DropdownMenuContentProps as DropdownMenuContentPrimitiveProps,
	DropdownMenuGroup as DropdownMenuGroupPrimitive,
	type DropdownMenuGroupProps as DropdownMenuGroupPrimitiveProps,
	DropdownMenuHighlightItem as DropdownMenuHighlightItemPrimitive,
	DropdownMenuHighlight as DropdownMenuHighlightPrimitive,
	DropdownMenuItemIndicator as DropdownMenuItemIndicatorPrimitive,
	DropdownMenuItem as DropdownMenuItemPrimitive,
	type DropdownMenuItemProps as DropdownMenuItemPrimitiveProps,
	DropdownMenuLabel as DropdownMenuLabelPrimitive,
	type DropdownMenuLabelProps as DropdownMenuLabelPrimitiveProps,
	DropdownMenu as DropdownMenuPrimitive,
	type DropdownMenuProps as DropdownMenuPrimitiveProps,
	DropdownMenuRadioGroup as DropdownMenuRadioGroupPrimitive,
	type DropdownMenuRadioGroupProps as DropdownMenuRadioGroupPrimitiveProps,
	DropdownMenuRadioItem as DropdownMenuRadioItemPrimitive,
	type DropdownMenuRadioItemProps as DropdownMenuRadioItemPrimitiveProps,
	DropdownMenuSeparator as DropdownMenuSeparatorPrimitive,
	type DropdownMenuSeparatorProps as DropdownMenuSeparatorPrimitiveProps,
	DropdownMenuShortcut as DropdownMenuShortcutPrimitive,
	type DropdownMenuShortcutProps as DropdownMenuShortcutPrimitiveProps,
	DropdownMenuSubContent as DropdownMenuSubContentPrimitive,
	type DropdownMenuSubContentProps as DropdownMenuSubContentPrimitiveProps,
	DropdownMenuSub as DropdownMenuSubPrimitive,
	type DropdownMenuSubProps as DropdownMenuSubPrimitiveProps,
	DropdownMenuSubTrigger as DropdownMenuSubTriggerPrimitive,
	type DropdownMenuSubTriggerProps as DropdownMenuSubTriggerPrimitiveProps,
	DropdownMenuTrigger as DropdownMenuTriggerPrimitive,
	type DropdownMenuTriggerProps as DropdownMenuTriggerPrimitiveProps,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";
import { cn } from "@/lib/utils";

type DropdownMenuProps = DropdownMenuPrimitiveProps;

function DropdownMenu(props: DropdownMenuProps) {
	return <DropdownMenuPrimitive {...props} />;
}

type DropdownMenuTriggerProps = DropdownMenuTriggerPrimitiveProps;

function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
	return <DropdownMenuTriggerPrimitive {...props} />;
}

type DropdownMenuContentProps = DropdownMenuContentPrimitiveProps;

function DropdownMenuContent({
	sideOffset = 4,
	className,
	children,
	...props
}: DropdownMenuContentProps) {
	return (
		<DropdownMenuContentPrimitive
			sideOffset={sideOffset}
			className={cn(
				"bg-popover text-popover-foreground z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none",
				className,
			)}
			{...props}
		>
			<DropdownMenuHighlightPrimitive className="z-0 absolute inset-0 bg-accent rounded-sm">
				{children}
			</DropdownMenuHighlightPrimitive>
		</DropdownMenuContentPrimitive>
	);
}

type DropdownMenuGroupProps = DropdownMenuGroupPrimitiveProps;

function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
	return <DropdownMenuGroupPrimitive {...props} />;
}

type DropdownMenuItemProps = DropdownMenuItemPrimitiveProps & {
	inset?: boolean;
	variant?: "default" | "destructive";
};

function DropdownMenuItem({
	className,
	inset,
	variant = "default",
	disabled,
	...props
}: DropdownMenuItemProps) {
	return (
		<DropdownMenuHighlightItemPrimitive
			activeClassName={
				variant === "destructive"
					? "bg-destructive/10 dark:bg-destructive/20"
					: ""
			}
			disabled={disabled}
		>
			<DropdownMenuItemPrimitive
				disabled={disabled}
				data-inset={inset}
				data-variant={variant}
				className={cn(
					"focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					className,
				)}
				{...props}
			/>
		</DropdownMenuHighlightItemPrimitive>
	);
}

type DropdownMenuCheckboxItemProps = DropdownMenuCheckboxItemPrimitiveProps;

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	disabled,
	...props
}: DropdownMenuCheckboxItemProps) {
	return (
		<DropdownMenuHighlightItemPrimitive disabled={disabled}>
			<DropdownMenuCheckboxItemPrimitive
				disabled={disabled}
				className={cn(
					"focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					className,
				)}
				checked={checked}
				{...props}
			>
				<span className="left-2 absolute flex justify-center items-center size-3.5 pointer-events-none">
					<DropdownMenuItemIndicatorPrimitive
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<CheckIcon className="size-4" />
					</DropdownMenuItemIndicatorPrimitive>
				</span>
				{children}
			</DropdownMenuCheckboxItemPrimitive>
		</DropdownMenuHighlightItemPrimitive>
	);
}

type DropdownMenuRadioGroupProps = DropdownMenuRadioGroupPrimitiveProps;

function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
	return <DropdownMenuRadioGroupPrimitive {...props} />;
}

type DropdownMenuRadioItemProps = DropdownMenuRadioItemPrimitiveProps;

function DropdownMenuRadioItem({
	className,
	children,
	disabled,
	...props
}: DropdownMenuRadioItemProps) {
	return (
		<DropdownMenuHighlightItemPrimitive disabled={disabled}>
			<DropdownMenuRadioItemPrimitive
				disabled={disabled}
				className={cn(
					"focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					className,
				)}
				{...props}
			>
				<span className="left-2 absolute flex justify-center items-center size-3.5 pointer-events-none">
					<DropdownMenuItemIndicatorPrimitive layoutId="dropdown-menu-item-indicator-radio">
						<CircleIcon className="fill-current size-2" />
					</DropdownMenuItemIndicatorPrimitive>
				</span>
				{children}
			</DropdownMenuRadioItemPrimitive>
		</DropdownMenuHighlightItemPrimitive>
	);
}

type DropdownMenuLabelProps = DropdownMenuLabelPrimitiveProps & {
	inset?: boolean;
};

function DropdownMenuLabel({
	className,
	inset,
	...props
}: DropdownMenuLabelProps) {
	return (
		<DropdownMenuLabelPrimitive
			data-inset={inset}
			className={cn(
				"px-2 py-1.5 data-inset:pl-8 font-medium text-sm",
				className,
			)}
			{...props}
		/>
	);
}

type DropdownMenuSeparatorProps = DropdownMenuSeparatorPrimitiveProps;

function DropdownMenuSeparator({
	className,
	...props
}: DropdownMenuSeparatorProps) {
	return (
		<DropdownMenuSeparatorPrimitive
			className={cn("-mx-1 my-1 bg-border h-px", className)}
			{...props}
		/>
	);
}

type DropdownMenuShortcutProps = DropdownMenuShortcutPrimitiveProps;

function DropdownMenuShortcut({
	className,
	...props
}: DropdownMenuShortcutProps) {
	return (
		<DropdownMenuShortcutPrimitive
			className={cn(
				"ml-auto text-muted-foreground text-xs tracking-widest",
				className,
			)}
			{...props}
		/>
	);
}

type DropdownMenuSubProps = DropdownMenuSubPrimitiveProps;

function DropdownMenuSub(props: DropdownMenuSubProps) {
	return <DropdownMenuSubPrimitive {...props} />;
}

type DropdownMenuSubTriggerProps = DropdownMenuSubTriggerPrimitiveProps & {
	inset?: boolean;
};

function DropdownMenuSubTrigger({
	disabled,
	className,
	inset,
	children,
	...props
}: DropdownMenuSubTriggerProps) {
	return (
		<DropdownMenuHighlightItemPrimitive disabled={disabled}>
			<DropdownMenuSubTriggerPrimitive
				disabled={disabled}
				data-inset={inset}
				className={cn(
					"flex items-center px-2 py-1.5 data-inset:pl-8 rounded-sm outline-hidden text-sm data-[state=open]:text-accent-foreground focus:text-accent-foreground cursor-default select-none",
					"data-[state=open]:**:data-[slot=chevron]:rotate-90 **:data-[slot=chevron]:transition-transform **:data-[slot=chevron]:duration-300 **:data-[slot=chevron]:ease-in-out",
					className,
				)}
				{...props}
			>
				{children}
				<ChevronRightIcon data-slot="chevron" className="ml-auto size-4" />
			</DropdownMenuSubTriggerPrimitive>
		</DropdownMenuHighlightItemPrimitive>
	);
}

type DropdownMenuSubContentProps = DropdownMenuSubContentPrimitiveProps;

function DropdownMenuSubContent({
	className,
	...props
}: DropdownMenuSubContentProps) {
	return (
		<DropdownMenuSubContentPrimitive
			className={cn(
				"bg-popover text-popover-foreground z-50 min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg outline-none",
				className,
			)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	type DropdownMenuCheckboxItemProps,
	type DropdownMenuContentProps,
	type DropdownMenuGroupProps,
	type DropdownMenuItemProps,
	type DropdownMenuLabelProps,
	type DropdownMenuProps,
	type DropdownMenuRadioGroupProps,
	type DropdownMenuRadioItemProps,
	type DropdownMenuSeparatorProps,
	type DropdownMenuShortcutProps,
	type DropdownMenuSubContentProps,
	type DropdownMenuSubProps,
	type DropdownMenuSubTriggerProps,
	type DropdownMenuTriggerProps,
};
