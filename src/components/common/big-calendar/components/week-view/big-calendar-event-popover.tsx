import { Clock, MapPin } from "lucide-react";
import type React from "react";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { IBigCalendarEvent } from "@/types/big-calendar";

export interface IBigCalendarEventPopoverItem {
	key?: string;
	icon?: React.ElementType;
	content: React.ReactNode;
}

export interface IBigCalendarEventPopoverProps {
	event: IBigCalendarEvent;
	/** Element trigger popover (thường là event block content) */
	children: React.ReactNode;
	/** Danh sách các dòng thông tin (icon + text). Nếu không truyền sẽ lấy default là Time và Location */
	items?:
		| IBigCalendarEventPopoverItem[]
		| ((event: IBigCalendarEvent) => IBigCalendarEventPopoverItem[]);
	/** Nội dung custom hiển thị thêm bên trong popover */
	customContent?:
		| React.ReactNode
		| ((event: IBigCalendarEvent) => React.ReactNode);
	/** Class name cho nội dung popover */
	className?: string;
	/** Trạng thái mở/đóng (controlled) */
	open?: boolean;
	/** Callback khi trạng thái mở/đóng thay đổi */
	onOpenChange?: (open: boolean) => void;
}

function formatTime(date: Date): string {
	const h = date.getHours();
	const m = date.getMinutes();
	const ampm = h >= 12 ? "PM" : "AM";
	const hour = h % 12 || 12;
	return m === 0
		? `${hour} ${ampm}`
		: `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatEventTimeRange(start: Date, end: Date): string {
	const isSameDay =
		start.getFullYear() === end.getFullYear() &&
		start.getMonth() === end.getMonth() &&
		start.getDate() === end.getDate();

	if (isSameDay) {
		return `${formatTime(start)} - ${formatTime(end)}`;
	}
	return `${start.toLocaleDateString()} ${formatTime(start)} - ${end.toLocaleDateString()} ${formatTime(end)}`;
}

/**
 * Component hỗ trợ bọc nội dung một event thành một Popover.
 * Giúp hiển thị thông tin chi tiết nhanh khi click vào event.
 * Khuyên dùng bên trong thuộc tính `renderEvent` của `<BigCalendar>`.
 */
export function BigCalendarEventPopover({
	event,
	children,
	items,
	customContent,
	className,
	open,
	onOpenChange,
}: IBigCalendarEventPopoverProps) {
	const displayItems = (
		typeof items === "function"
			? items(event)
			: (items ?? [
					{
						icon: Clock,
						content: formatEventTimeRange(event.start, event.end),
					},
					...(event.meta?.location
						? [
								{
									icon: MapPin,
									content: String(event.meta.location),
								},
							]
						: []),
				])
	) as IBigCalendarEventPopoverItem[];

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger
				render={
					<div className="h-full w-full cursor-pointer ring-offset-background outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
				}
			>
				{children}
			</PopoverTrigger>
			<PopoverContent
				className={cn("w-80", className)}
				align="start"
				side="right"
				sideOffset={8}
				onClick={(e) => e.stopPropagation()} // Ngăn click lan ra ngoài làm trigger các action khác của calendar
			>
				<PopoverHeader className="gap-2">
					{/* Header với dot color và title */}
					<div className="flex items-start gap-2">
						<PopoverTitle className="leading-tight">{event.title}</PopoverTitle>
					</div>

					{/* Metadata: Time & Location */}
					<div className="flex flex-col gap-2">
						{displayItems.map((item) => {
							const Icon = item.icon;
							const itemKey = item.key || (Icon ? (Icon as any).name : "info");
							return (
								<PopoverDescription
									key={itemKey}
									className="flex items-center gap-2 text-xs"
								>
									{Icon && <Icon className="size-3.5 shrink-0" />}
									<span>{item.content}</span>
								</PopoverDescription>
							);
						})}
					</div>
				</PopoverHeader>

				{/* Custom Content Divider */}
				{customContent && (
					<div className="mt-1 border-t pt-3">
						{typeof customContent === "function"
							? customContent(event)
							: customContent}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
