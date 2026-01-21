import type { ColumnDef } from "@tanstack/react-table";
import { CaseSensitive, Hash, TextInitial, User } from "lucide-react";
import { useMemo } from "react";
import {
	DataTable,
	DataTableAdvancedToolbar,
	DataTableColumnHeader,
	DataTableFilterMenu,
	DataTableSortList,
} from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import type { Post } from "../types/post.types";

interface PostsTableProps {
	posts: Post[];
	pageCount: number;
	isLoading?: boolean;
}

export const PostsTable = ({
	posts,
	pageCount,
	isLoading,
}: PostsTableProps) => {
	const postColumns = useMemo<ColumnDef<Post>[]>(
		() => [
			{
				id: "id",
				accessorKey: "id",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="ID" label="ID" />
				),
				cell: ({ row }) => <div>{row.original.id}</div>,
				meta: {
					label: "ID",
					icon: Hash,
				},
				enableSorting: true,
			},
			{
				id: "title",
				accessorKey: "title",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Title" label="Title" />
				),
				cell: ({ row }) => (
					<div className="truncate max-w-[300px]" title={row.original.title}>
						{row.original.title}
					</div>
				),
				meta: {
					label: "Title",
					placeholder: "Search title...",
					variant: "text",
					icon: CaseSensitive,
				},
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				id: "body",
				accessorKey: "body",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Body" label="Body" />
				),
				cell: ({ row }) => (
					<div className="truncate max-w-[500px]" title={row.original.body}>
						{row.original.body}
					</div>
				),
				meta: {
					label: "Body",
					placeholder: "Search body...",
					variant: "text",
					icon: TextInitial,
				},
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				id: "userId",
				accessorKey: "userId",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title="User ID"
						label="User ID"
					/>
				),
				cell: ({ row }) => <div>{row.original.userId}</div>,
				meta: {
					label: "User ID",
					icon: User,
					variant: "text",
					placeholder: "Search user...",
				},
				enableSorting: true,
				enableColumnFilter: true,
			},
		],
		[],
	);

	const { table, shallow, debounceMs, throttleMs } = useDataTable({
		data: posts,
		columns: postColumns,
		pageCount,
		getRowId: (row) => row.id.toString(),
		queryKeys: {
			page: "page",
			perPage: "perPage",
			sort: "sort",
		},
		enableAdvancedFilter: true,
		shallow: true,
		clearOnDefault: true,
	});

	if (isLoading) {
		return (
			<DataTableSkeleton
				columnCount={postColumns.length}
				rowCount={table.getState().pagination.pageSize}
			/>
		);
	}

	return (
		<DataTable table={table}>
			<DataTableAdvancedToolbar table={table}>
				<DataTableSortList table={table} />
				<DataTableFilterMenu
					table={table}
					shallow={shallow}
					debounceMs={debounceMs}
					throttleMs={throttleMs}
				/>
			</DataTableAdvancedToolbar>
		</DataTable>
	);
};
