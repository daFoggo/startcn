import type { Cell, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { getPinnedCellStyle } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface IDataTableRowProps<TData> {
	row: Row<TData>;
	className?: string;
	onClick?: (row: Row<TData>) => void;
}

export const DataTableRow = <TData,>({
	row,
	className,
	onClick,
}: IDataTableRowProps<TData>) => {
	return (
		<TableRow
			data-state={row.getIsSelected() ? "selected" : undefined}
			className={cn(
				"group/row transition-colors duration-300 ease-in-out",
				onClick && "cursor-pointer",
				className,
			)}
			onClick={() => onClick?.(row)}
		>
			{row.getVisibleCells().map((cell) => (
				<DataTableCell key={cell.id} cell={cell} />
			))}
		</TableRow>
	);
};

interface IDataTableCellProps<TData> {
	cell: Cell<TData, unknown>;
}

export const DataTableCell = <TData,>({ cell }: IDataTableCellProps<TData>) => {
	const column = cell.column;
	const isPinned = column.getIsPinned();
	const isFirstRight = column.getIsFirstColumn("right");
	const isLastLeft = column.getIsLastColumn("left");

	const pinnedStyle = getPinnedCellStyle(
		isPinned,
		column.getStart(isPinned || "center"),
		column.getAfter(isPinned || "center"),
	);

	return (
		<TableCell
			style={{
				...pinnedStyle,
				width: column.getSize(),
				minWidth: column.columnDef.minSize,
			}}
			className={cn(
				"bg-background transition-colors duration-300 ease-in-out",
				// Row-Level Highlight (syncs across opaque pinned cells)
				"group-hover/row:bg-muted/50 group-data-[state=selected]/row:bg-muted",
				isPinned === "left" && isLastLeft && "border-r border-border/50",
				isPinned === "right" && isFirstRight && "border-l border-border/50",
				column.columnDef.meta?.cellClassName,
			)}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</TableCell>
	);
};
