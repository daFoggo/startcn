import {
	IconChevronDown as ChevronDown,
	IconChevronRight as ChevronRight,
} from "@tabler/icons-react";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface IDataTableGroupRowProps<TData> {
	row: Row<TData>;
	totalCols: number;
}

export const DataTableGroupRow = <TData,>({
	row,
	totalCols,
}: IDataTableGroupRowProps<TData>) => {
	const isExpanded = row.getIsExpanded();
	const groupValue = String(row.groupingValue ?? "");
	const subRowCount = row.subRows.length;

	// Extract custom rendering logic from the grouped column's meta if available
	const column = row
		.getAllCells()
		.find((c) => c.column.id === row.groupingColumnId)?.column;
	const meta = column?.columnDef.meta as any;

	let renderedValue: React.ReactNode = (
		<span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">
			{groupValue}
		</span>
	);

	if (meta?.renderGroupValue) {
		renderedValue = meta.renderGroupValue(groupValue);
	}

	return (
		<TableRow
			className="group/row border-b bg-muted/40 transition-colors duration-300 ease-in-out hover:bg-transparent"
			key={row.id}
		>
			<TableCell
				colSpan={totalCols}
				className="h-10 overflow-visible p-0 align-middle whitespace-nowrap transition-colors duration-300 ease-in-out group-hover/row:bg-muted/60"
			>
				<div className="sticky left-0 z-10 flex w-fit items-center gap-1 px-1">
					<Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-2 rounded-md px-1 py-1 text-left transition-colors duration-300 ease-in-out hover:bg-accent"
						onClick={(e) => {
							e.stopPropagation();
							row.getToggleExpandedHandler()();
						}}
					>
						<span className="text-muted-foreground/60">
							{isExpanded ? (
								<ChevronDown className="size-4" />
							) : (
								<ChevronRight className="size-4" />
							)}
						</span>
						{renderedValue}
						<span className="text-xs font-medium text-muted-foreground/50 tabular-nums">
							({subRowCount})
						</span>
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
};
