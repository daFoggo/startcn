import { Slot } from "radix-ui";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";

interface ActionBarContextValue {
	onOpenChange?: (open: boolean) => void;
	orientation: Orientation;
}

const ActionBarContext = React.createContext<ActionBarContextValue | null>(
	null,
);

const useActionBarContext = (component: string) => {
	const context = React.useContext(ActionBarContext);

	if (!context) {
		throw new Error(`${component} must be used within ActionBar`);
	}

	return context;
};

interface ActionBarProps extends React.ComponentProps<"div"> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	align?: "start" | "center" | "end";
	alignOffset?: number;
	side?: "top" | "bottom";
	sideOffset?: number;
	portalContainer?: Element | DocumentFragment | null;
	orientation?: Orientation;
	asChild?: boolean;
}

function ActionBar({
	open = false,
	onOpenChange,
	onEscapeKeyDown,
	align = "center",
	alignOffset = 16,
	side = "bottom",
	sideOffset = 16,
	portalContainer,
	orientation = "horizontal",
	asChild,
	className,
	style,
	children,
	...props
}: ActionBarProps) {
	const [mounted, setMounted] = React.useState(false);
	const rootRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	React.useEffect(() => {
		if (!open) return;

		const ownerDocument = rootRef.current?.ownerDocument ?? document;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;

			onEscapeKeyDown?.(event);

			if (!event.defaultPrevented) {
				onOpenChange?.(false);
			}
		};

		ownerDocument.addEventListener("keydown", handleKeyDown);

		return () => ownerDocument.removeEventListener("keydown", handleKeyDown);
	}, [open, onEscapeKeyDown, onOpenChange]);

	const container =
		portalContainer ?? (mounted ? globalThis.document?.body : null);

	if (!open || !container) return null;

	const Root = asChild ? Slot.Root : "div";
	const contextValue = {
		onOpenChange,
		orientation,
	} satisfies ActionBarContextValue;

	return ReactDOM.createPortal(
		<ActionBarContext.Provider value={contextValue}>
			<Root
				ref={rootRef}
				role="toolbar"
				aria-orientation={orientation}
				data-slot="action-bar"
				data-side={side}
				data-align={align}
				data-orientation={orientation}
				className={cn(
					"fixed z-50 rounded-lg border bg-card text-card-foreground shadow-lg outline-none",
					"motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200",
					side === "bottom" && "motion-safe:slide-in-from-bottom-4",
					side === "top" && "motion-safe:slide-in-from-top-4",
					orientation === "horizontal"
						? "flex items-center gap-2 px-2 py-1.5"
						: "flex flex-col items-stretch gap-2 px-1.5 py-2",
					align === "center" && "left-1/2 -translate-x-1/2",
					align === "start" && "left-(--action-bar-align-offset)",
					align === "end" && "right-(--action-bar-align-offset)",
					className,
				)}
				style={
					{
						"--action-bar-align-offset": `${alignOffset}px`,
						[side]: `${sideOffset}px`,
						...style,
					} as React.CSSProperties
				}
				{...props}
			>
				{children}
			</Root>
		</ActionBarContext.Provider>,
		container,
	);
}

interface ActionBarSelectionProps extends React.ComponentProps<"div"> {
	asChild?: boolean;
}

function ActionBarSelection({
	asChild,
	className,
	...props
}: ActionBarSelectionProps) {
	const Selection = asChild ? Slot.Root : "div";

	return (
		<Selection
			data-slot="action-bar-selection"
			className={cn(
				"flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-sm font-medium tabular-nums",
				className,
			)}
			{...props}
		/>
	);
}

interface ActionBarGroupProps extends React.ComponentProps<"div"> {
	asChild?: boolean;
}

function ActionBarGroup({
	asChild,
	className,
	onKeyDown,
	...props
}: ActionBarGroupProps) {
	const { orientation } = useActionBarContext("ActionBarGroup");
	const Group = asChild ? Slot.Root : "div";

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		if (event.defaultPrevented) return;

		const isHorizontal = orientation === "horizontal";
		const isPreviousKey = isHorizontal
			? event.key === "ArrowLeft"
			: event.key === "ArrowUp";
		const isNextKey = isHorizontal
			? event.key === "ArrowRight"
			: event.key === "ArrowDown";

		if (
			!isPreviousKey &&
			!isNextKey &&
			event.key !== "Home" &&
			event.key !== "End"
		) {
			return;
		}

		const items = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>(
				"[data-slot='action-bar-item']:not(:disabled)",
			),
		);

		if (items.length === 0) return;

		event.preventDefault();

		const activeIndex = items.indexOf(
			event.currentTarget.ownerDocument.activeElement as HTMLElement,
		);
		const lastIndex = items.length - 1;

		let nextIndex = activeIndex;

		if (event.key === "Home") {
			nextIndex = 0;
		} else if (event.key === "End") {
			nextIndex = lastIndex;
		} else if (isPreviousKey) {
			nextIndex = activeIndex <= 0 ? lastIndex : activeIndex - 1;
		} else if (isNextKey) {
			nextIndex = activeIndex >= lastIndex ? 0 : activeIndex + 1;
		}

		items[nextIndex]?.focus();
	};

	return (
		<Group
			role="group"
			data-slot="action-bar-group"
			data-orientation={orientation}
			className={cn(
				"flex gap-2 outline-none",
				orientation === "horizontal"
					? "items-center"
					: "flex-col items-stretch",
				className,
			)}
			onKeyDown={handleKeyDown}
			{...props}
		/>
	);
}

interface ActionBarItemProps
	extends Omit<React.ComponentProps<typeof Button>, "onSelect"> {
	onSelect?: (event: Event) => void;
	closeOnSelect?: boolean;
}

function ActionBarItem({
	onSelect,
	closeOnSelect = true,
	onClick,
	className,
	variant = "secondary",
	size = "sm",
	...props
}: ActionBarItemProps) {
	const { onOpenChange, orientation } = useActionBarContext("ActionBarItem");

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(event);
		if (event.defaultPrevented) return;

		const selectEvent = new Event("actionbar.itemSelect", {
			bubbles: true,
			cancelable: true,
		});

		onSelect?.(selectEvent);

		if (closeOnSelect && !selectEvent.defaultPrevented) {
			onOpenChange?.(false);
		}
	};

	return (
		<Button
			type="button"
			data-slot="action-bar-item"
			variant={variant}
			size={size}
			className={cn(orientation === "vertical" && "w-full", className)}
			onClick={handleClick}
			{...props}
		/>
	);
}

interface ActionBarCloseProps extends React.ComponentProps<"button"> {
	asChild?: boolean;
}

function ActionBarClose({
	asChild,
	className,
	onClick,
	...props
}: ActionBarCloseProps) {
	const { onOpenChange } = useActionBarContext("ActionBarClose");
	const Close = asChild ? Slot.Root : "button";

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(event);
		if (!event.defaultPrevented) {
			onOpenChange?.(false);
		}
	};

	return (
		<Close
			type="button"
			data-slot="action-bar-close"
			className={cn(
				"rounded-md p-1 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			onClick={handleClick}
			{...props}
		/>
	);
}

interface ActionBarSeparatorProps extends React.ComponentProps<"div"> {
	orientation?: Orientation;
	asChild?: boolean;
}

function ActionBarSeparator({
	orientation: orientationProp,
	asChild,
	className,
	...props
}: ActionBarSeparatorProps) {
	const context = useActionBarContext("ActionBarSeparator");
	const orientation = orientationProp ?? context.orientation;
	const Separator = asChild ? Slot.Root : "div";

	return (
		<Separator
			role="separator"
			aria-orientation={orientation}
			aria-hidden="true"
			data-slot="action-bar-separator"
			className={cn(
				"shrink-0 bg-border",
				orientation === "horizontal" ? "h-6 w-px" : "h-px w-full",
				className,
			)}
			{...props}
		/>
	);
}

export {
	ActionBar,
	ActionBarClose,
	ActionBarGroup,
	ActionBarItem,
	type ActionBarItemProps,
	type ActionBarProps,
	ActionBarSelection,
	ActionBarSeparator,
};
