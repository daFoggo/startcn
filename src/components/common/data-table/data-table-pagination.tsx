import type { Table } from "@tanstack/react-table";
import {
	ChevronDown,
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface IDataTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizeOptions?: number[];
	showRowCount?: boolean;
	showRowsPerPage?: boolean;
	showSelectedCount?: boolean;
	enablePagination?: boolean;
}

export const DataTablePagination = <TData,>({
	table,
	pageSizeOptions = [10, 20, 50, 100],
	showRowCount = true,
	showRowsPerPage = true,
	showSelectedCount = true,
	enablePagination = true,
}: IDataTablePaginationProps<TData>) => {
	const pagination = table.getState().pagination;
	const pageIndex = pagination?.pageIndex ?? 0;
	const pageSize = pagination?.pageSize ?? 0;
	const pageCount = enablePagination ? table.getPageCount() : 0;

	// Requirement: Only count actual leaf records, not group headers or sub-tasks.
	// We use the filtered row model to respect search/filter state.
	const rowCount = table
		.getFilteredRowModel()
		.flatRows.filter((r) => !r.getIsGrouped()).length;
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;

	return (
		<div className="flex items-center justify-between gap-4 px-3 py-2 text-sm whitespace-nowrap text-muted-foreground">
			{/* Left: row count + selection */}
			<div className="flex items-center gap-3">
				{showSelectedCount && selectedCount > 0 && (
					<span className="text-xs font-medium text-foreground">
						{selectedCount} selected
					</span>
				)}
				{showRowCount && (
					<span className="text-xs">{rowCount.toLocaleString()} rows</span>
				)}
			</div>

			{/* Right: rows-per-page + navigation */}
			<div className="flex items-center gap-4">
				{/* Rows per page — Dropdown Menu */}
				{enablePagination && showRowsPerPage && (
					<div className="flex items-center gap-2">
						<span className="text-xs">Rows per page</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="flex h-7 w-16 justify-between px-2 text-xs font-normal"
								>
									<span>{pageSize}</span>
									<ChevronDown className="size-3 text-muted-foreground/70" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="min-w-16">
								{pageSizeOptions.map((size) => (
									<DropdownMenuItem
										key={size}
										className={cn(
											"text-xs",
											pageSize === size && "bg-accent font-medium",
										)}
										onClick={() => table.setPageSize(Number(size))}
									>
										{size}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}

				{/* Page x of y */}
				{enablePagination && (
					<span className="text-xs whitespace-nowrap">
						Page {pageIndex + 1} of {pageCount || 1}
					</span>
				)}

				{/* Navigation buttons */}
				{enablePagination && (
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							onClick={() => table.firstPage()}
							disabled={!table.getCanPreviousPage()}
							aria-label="First page"
						>
							<ChevronFirst className="size-3.5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							aria-label="Previous page"
						>
							<ChevronLeft className="size-3.5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							aria-label="Next page"
						>
							<ChevronRight className="size-3.5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							onClick={() => table.lastPage()}
							disabled={!table.getCanNextPage()}
							aria-label="Last page"
						>
							<ChevronLast className="size-3.5" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
