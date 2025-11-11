import { XIcon } from "lucide-react";
import {
	SheetClose as SheetClosePrimitive,
	type SheetCloseProps as SheetClosePrimitiveProps,
	SheetContent as SheetContentPrimitive,
	type SheetContentProps as SheetContentPrimitiveProps,
	SheetDescription as SheetDescriptionPrimitive,
	type SheetDescriptionProps as SheetDescriptionPrimitiveProps,
	SheetFooter as SheetFooterPrimitive,
	type SheetFooterProps as SheetFooterPrimitiveProps,
	SheetHeader as SheetHeaderPrimitive,
	type SheetHeaderProps as SheetHeaderPrimitiveProps,
	SheetOverlay as SheetOverlayPrimitive,
	type SheetOverlayProps as SheetOverlayPrimitiveProps,
	SheetPortal as SheetPortalPrimitive,
	Sheet as SheetPrimitive,
	type SheetProps as SheetPrimitiveProps,
	SheetTitle as SheetTitlePrimitive,
	type SheetTitleProps as SheetTitlePrimitiveProps,
	SheetTrigger as SheetTriggerPrimitive,
	type SheetTriggerProps as SheetTriggerPrimitiveProps,
} from "@/components/animate-ui/primitives/radix/sheet";
import { cn } from "@/lib/utils";

type SheetProps = SheetPrimitiveProps;

function Sheet(props: SheetProps) {
	return <SheetPrimitive {...props} />;
}

type SheetTriggerProps = SheetTriggerPrimitiveProps;

function SheetTrigger(props: SheetTriggerProps) {
	return <SheetTriggerPrimitive {...props} />;
}

type SheetOverlayProps = SheetOverlayPrimitiveProps;

function SheetOverlay({ className, ...props }: SheetOverlayProps) {
	return (
		<SheetOverlayPrimitive
			className={cn("z-50 fixed inset-0 bg-black/50", className)}
			{...props}
		/>
	);
}

type SheetCloseProps = SheetClosePrimitiveProps;

function SheetClose(props: SheetCloseProps) {
	return <SheetClosePrimitive {...props} />;
}

type SheetContentProps = SheetContentPrimitiveProps & {
	showCloseButton?: boolean;
};

function SheetContent({
	className,
	children,
	side = "right",
	showCloseButton = true,
	...props
}: SheetContentProps) {
	return (
		<SheetPortalPrimitive>
			<SheetOverlay />
			<SheetContentPrimitive
				className={cn(
					"z-50 fixed flex flex-col gap-4 bg-background shadow-lg",
					side === "right" && "h-full w-[350px] border-l",
					side === "left" && "h-full w-[350px] border-r",
					side === "top" && "w-full h-[350px] border-b",
					side === "bottom" && "w-full h-[350px] border-t",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<SheetClose className="top-4 right-4 absolute data-[state=open]:bg-secondary opacity-70 hover:opacity-100 rounded-xs focus:outline-hidden focus:ring-2 focus:ring-ring ring-offset-background focus:ring-offset-2 transition-opacity disabled:pointer-events-none">
						<XIcon className="size-4" />
						<span className="sr-only">Close</span>
					</SheetClose>
				)}
			</SheetContentPrimitive>
		</SheetPortalPrimitive>
	);
}

type SheetHeaderProps = SheetHeaderPrimitiveProps;

function SheetHeader({ className, ...props }: SheetHeaderProps) {
	return (
		<SheetHeaderPrimitive
			className={cn("flex flex-col gap-1.5 p-4", className)}
			{...props}
		/>
	);
}

type SheetFooterProps = SheetFooterPrimitiveProps;

function SheetFooter({ className, ...props }: SheetFooterProps) {
	return (
		<SheetFooterPrimitive
			className={cn("flex flex-col gap-2 mt-auto p-4", className)}
			{...props}
		/>
	);
}

type SheetTitleProps = SheetTitlePrimitiveProps;

function SheetTitle({ className, ...props }: SheetTitleProps) {
	return (
		<SheetTitlePrimitive
			className={cn("font-semibold text-foreground", className)}
			{...props}
		/>
	);
}

type SheetDescriptionProps = SheetDescriptionPrimitiveProps;

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
	return (
		<SheetDescriptionPrimitive
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	type SheetCloseProps,
	type SheetContentProps,
	type SheetDescriptionProps,
	type SheetFooterProps,
	type SheetHeaderProps,
	type SheetProps,
	type SheetTitleProps,
	type SheetTriggerProps,
};
