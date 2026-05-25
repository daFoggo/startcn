import type { ColumnDef, Row } from "@tanstack/react-table";
import type { CSSProperties } from "react";
import type { IDataTableColumnDef } from "@/types/data-table";

/**
 * Chuyển đổi các định nghĩa cột thô (IDataTableColumnDef) thành cấu hình cột chuẩn của TanStack Table.
 */
export function generateColumns<TData>(
	definitions: IDataTableColumnDef<TData>[],
): ColumnDef<TData, any>[] {
	return definitions.map((def) => {
		return {
			id: def.id ?? def.accessorKey,
			accessorKey: def.accessorKey,
			header: def.header ?? def.label,
			size: def.size,
			cell: def.cell,
			meta: {
				label: def.label,
				enablePinning: def.enablePinning,
				enableReorder: def.enableReorder,
				renderGroupValue: def.renderGroupValue,
				headerClassName: def.headerClassName,
				cellClassName: def.cellClassName,
				isSelectColumn: def.isSelectColumn,
				isActionColumn: def.isActionColumn,
			},
		} as ColumnDef<TData, any>;
	});
}

/**
 * Các hàm tiện ích hỗ trợ cho việc hiển thị và xử lý logic bảng (Data Table).
 */

export function getPinnedCellStyle(
	isPinned: "left" | "right" | false,
	start: number,
	after: number,
): CSSProperties {
	if (!isPinned) return {};

	return {
		position: "sticky",
		left: isPinned === "left" ? `${start}px` : undefined,
		right: isPinned === "right" ? `${after}px` : undefined,
		zIndex: 2,
		// Đảm bảo không bị trong suốt
		backgroundColor: "hsl(var(--background))",
	};
}

export function isGroupRow<TData>(row: Row<TData>): boolean {
	return row.getIsGrouped();
}
