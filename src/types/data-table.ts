import type {
	CellContext,
	HeaderContext,
	RowData,
} from "@tanstack/react-table";

// Extend TanStack's ColumnMeta to add custom metadata per column
declare module "@tanstack/react-table" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		/** Header display label (optional override) */
		label?: string;
		/** Whether this column can be pinned by the user via UI */
		enablePinning?: boolean;
		/** Whether this column can be reordered via drag-and-drop */
		enableReorder?: boolean;
		/** Custom class for header cell */
		headerClassName?: string;
		/** Custom class for data cell */
		cellClassName?: string;
		/** Custom renderer for grouped row values. */
		renderGroupValue?: (value: any) => React.ReactNode;
		/** Identifies this column as a Selection (Checkbox) column */
		isSelectColumn?: boolean;
		/** Identifies this column as an Actions column */
		isActionColumn?: boolean;
	}
}

export interface IDataTableColumnDef<TData, TValue = any> {
	/** Unique ID for the column. Required if accessorKey is not provided. */
	id?: string;
	/** Key to extract value from the data row. */
	accessorKey?: Extract<keyof TData, string>;
	/** Required: Label used for metadata, view options, and default header text. */
	label: string;
	/** Optional custom header text or render function. Overrides label. */
	header?:
		| string
		| ((context: HeaderContext<TData, TValue>) => React.ReactNode);
	/** Width size of the column. */
	size?: number;
	/** Whether the column can be pinned. Default: true (unless overridden). */
	enablePinning?: boolean;
	/** Whether the column can be reordered. Default: true. */
	enableReorder?: boolean;
	/** Custom renderer for grouped row values. */
	renderGroupValue?: (value: any) => React.ReactNode;
	/** Custom cell renderer. */
	cell?: (context: CellContext<TData, TValue>) => React.ReactNode;
	/** Additional classname for header. */
	headerClassName?: string;
	/** Additional classname for cell. */
	cellClassName?: string;
	/** Identifies this column as a Selection (Checkbox) column */
	isSelectColumn?: boolean;
	/** Identifies this column as an Actions column */
	isActionColumn?: boolean;
}
