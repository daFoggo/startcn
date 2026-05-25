"use client";

import type * as React from "react";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MultiSelectComboboxProps<T> {
	/** Danh sách tất cả các mục có thể chọn */
	items: Array<T>;
	/** Danh sách các mục đang được chọn (Dạng object hoàn chỉnh) */
	value: Array<T>;
	/** Callback khi thay đổi lựa chọn */
	onValueChange: (value: Array<T>) => void;
	/** Chuyển đổi một mục thành chuỗi để tìm kiếm */
	itemToString: (item: T) => string;
	/** Chuyển đổi một mục thành giá trị duy nhất (ID) */
	itemToValue: (item: T) => string;
	/** Tùy chỉnh cách hiển thị mục trong danh sách dropdown */
	renderItem?: (item: T) => React.ReactNode;
	/** Tùy chỉnh cách hiển thị Chip sau khi chọn */
	renderChip?: (item: T) => React.ReactNode;
	/** Placeholder cho input */
	placeholder?: string;
	/** Văn bản hiển thị khi không tìm thấy kết quả */
	emptyText?: string;
	/** Callback khi giá trị input thay đổi (dùng cho tìm kiếm server-side) */
	onInputValueChange?: (value: string) => void;
	/** Trạng thái đang tải dữ liệu */
	isLoading?: boolean;
	/** Ẩn border (dùng khi đặt trong các container đã có border) */
	hideBorder?: boolean;
	/** ClassName cho container chính */
	className?: string;
	/** ClassName cho phần trigger/chips container */
	triggerClassName?: string;
}

/**
 * Một component Combobox chọn nhiều (Multi-Select) dùng chung,
 * hỗ trợ Generic type để có thể làm việc với bất kỳ loại dữ liệu nào (User, TeamMember, etc.)
 */
export function MultiSelectCombobox<T>({
	items,
	value,
	onValueChange,
	itemToString,
	itemToValue,
	renderItem,
	renderChip,
	placeholder = "Select items...",
	emptyText = "No items found.",
	onInputValueChange,
	isLoading,
	hideBorder = false,
	className,
	triggerClassName,
}: MultiSelectComboboxProps<T>) {
	const anchor = useComboboxAnchor();

	return (
		<div className={cn("w-full", className)}>
			<Combobox
				multiple
				items={items}
				value={value}
				onValueChange={onValueChange}
				itemToStringValue={itemToString}
				onInputValueChange={onInputValueChange}
			>
				<ComboboxChips
					ref={anchor}
					className={cn(
						"w-full transition-all",
						hideBorder && "border-0 bg-transparent shadow-none ring-0",
						!hideBorder &&
							"bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
						triggerClassName,
					)}
				>
					<ComboboxValue>
						{(selectedItems: Array<T>) => (
							<>
								{selectedItems.map((item) => (
									<ComboboxChip key={itemToValue(item)}>
										{renderChip ? renderChip(item) : itemToString(item)}
									</ComboboxChip>
								))}
								<ComboboxChipsInput placeholder={placeholder} />
							</>
						)}
					</ComboboxValue>
				</ComboboxChips>
				<ComboboxContent anchor={anchor} className="min-w-64">
					<ComboboxEmpty className="py-4 text-center text-sm text-muted-foreground">
						{isLoading ? (
							<div className="flex flex-col gap-2 px-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						) : (
							emptyText
						)}
					</ComboboxEmpty>
					<ComboboxList>
						{(item: T) => (
							<ComboboxItem key={itemToValue(item)} value={item}>
								{renderItem ? (
									renderItem(item)
								) : (
									<span className="text-sm">{itemToString(item)}</span>
								)}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</div>
	);
}
