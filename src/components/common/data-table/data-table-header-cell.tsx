import type { DragDropManager } from "@dnd-kit/dom";
import { Sortable } from "@dnd-kit/dom/sortable";
import {
	IconGripVertical as GripVertical,
	IconPin as PinIcon,
} from "@tabler/icons-react";
import type { Header, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { getPinnedCellStyle } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface IDataTableHeaderCellProps<TData> {
	header: Header<TData, unknown>;
	/** Position within unpinned columns — required by vanilla Sortable */
	index: number;
	/** The full table instance — needed to compute first/last column positions */
	table: Table<TData>;
	/** The shared DragDropManager from DataTable */
	manager: DragDropManager | null;
	enableColumnReorder?: boolean;
	enableColumnPinning?: boolean;
}

export const DataTableHeaderCell = <TData,>({
	header,
	index,
	table,
	manager,
	enableColumnReorder = true,
	enableColumnPinning = true,
}: IDataTableHeaderCellProps<TData>) => {
	const column = header.column;
	const isPinned = column.getIsPinned();
	const isLastLeft = column.getIsLastColumn("left");
	const isFirstRight = column.getIsFirstColumn("right");

	// - select / actions: enablePinning: false → no pin button (display columns)
	// - Only 1 user-managed column can be pinned left (first unpinned → left)
	// - Right pinning only allowed if there is NO actions column in the table
	const isDisplayColumn = column.columnDef.meta?.enablePinning === false;

	const unpinnedLeaf = table.getCenterLeafColumns();
	const isFirstUnpinned = unpinnedLeaf[0]?.id === column.id;
	const isLastUnpinned =
		unpinnedLeaf[unpinnedLeaf.length - 1]?.id === column.id;

	// Count user-pinned left columns (anything pinned left that isn't a selection column)
	const userLeftPinnedCount = table
		.getLeftLeafColumns()
		.filter((c) => !c.columnDef.meta?.isSelectColumn).length;

	// Right-pinning allowed only when this table has no "actions" column flag
	const hasActionsColumn = table
		.getAllColumns()
		.some((c) => c.columnDef.meta?.isActionColumn);

	const canPinToLeft = isFirstUnpinned && userLeftPinnedCount === 0;
	const canPinToRight = isLastUnpinned && !hasActionsColumn;

	const canShowPinButton =
		enableColumnPinning &&
		!isDisplayColumn &&
		!header.isPlaceholder &&
		(isPinned || canPinToLeft || canPinToRight);

	// Drag & drop: only unpinned, non-display columns can be reordered
	const canReorder =
		enableColumnReorder &&
		!isPinned &&
		column.columnDef.meta?.enableReorder !== false;

	// Ref to the actual <th> DOM element
	const thRef = useRef<HTMLTableCellElement | null>(null);

	// Track isDragSource state for visual feedback (set via DOM class)
	const [isDragSource, setIsDragSource] = useState(false);

	// Register this column as a vanilla Sortable instance
	useEffect(() => {
		if (!canReorder || !thRef.current || !manager) return;

		const sortable = new Sortable(
			{
				id: column.id,
				index,
				element: thRef.current,
			},
			manager,
		);

		return () => sortable.destroy();
		// Re-run when column id, index, manager, or canReorder changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [column.id, index, canReorder, manager]);

	// React to drag state via the manager monitor
	useEffect(() => {
		if (!manager) return;

		const onDragStart = () => {
			const op = manager.dragOperation;
			if (op?.source?.id === column.id) setIsDragSource(true);
		};
		const onDragEnd = () => setIsDragSource(false);

		manager.monitor.addEventListener("dragstart", onDragStart);
		manager.monitor.addEventListener("dragend", onDragEnd);

		return () => {
			manager.monitor.removeEventListener("dragstart", onDragStart);
			manager.monitor.removeEventListener("dragend", onDragEnd);
		};
	}, [manager, column.id]);

	const pinnedStyle = getPinnedCellStyle(
		isPinned,
		column.getStart(isPinned || "center"),
		column.getAfter(isPinned || "center"),
	);

	return (
		<TableHead
			ref={thRef}
			colSpan={header.colSpan}
			style={{ ...pinnedStyle, width: header.getSize() }}
			className={cn(
				"group/head transition-colors duration-300 ease-in-out select-none",
				"bg-background hover:bg-muted/30",
				isDragSource && "bg-accent opacity-50 ring-2 ring-primary ring-inset",
				isPinned === "left" && isLastLeft && "border-r border-border/50",
				isPinned === "right" && isFirstRight && "border-l border-border/50",
			)}
		>
			<div className="flex items-center gap-1">
				{canReorder && (
					<GripVertical className="size-3.5 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity duration-300 ease-in-out group-hover/head:opacity-50" />
				)}

				<span className="flex-1 truncate font-semibold text-foreground">
					{header.isPlaceholder
						? null
						: flexRender(column.columnDef.header, header.getContext())}
				</span>

				{canShowPinButton && (
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"size-5 transition-opacity duration-300 ease-in-out",
							isPinned
								? "opacity-70 hover:opacity-100"
								: "opacity-0 group-hover/head:opacity-50 hover:opacity-100!",
						)}
						onClick={() => {
							if (isPinned) {
								column.pin(false);
							} else if (canPinToLeft) {
								column.pin("left");
							} else {
								column.pin("right");
							}
						}}
						title={
							isPinned
								? "Unpin column"
								: canPinToLeft
									? "Pin to left"
									: "Pin to right"
						}
					>
						<PinIcon className={cn("size-3", isPinned && "fill-current")} />
					</Button>
				)}
			</div>
		</TableHead>
	);
};
