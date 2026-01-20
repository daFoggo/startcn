import type { ColumnDef } from "@tanstack/react-table";
import { Building2, CaseSensitive, ExternalLink, Mail, MapPinned, Phone } from "lucide-react";
import { useMemo } from "react";
import {
	DataTable,
	DataTableAdvancedToolbar,
	DataTableColumnHeader,
	DataTableFilterMenu,
	DataTableSortList,
} from "@/components/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import type { User } from "../types/user.types";

interface TableViewContentProps {
	users: User[];
}

export const TableViewContent = ({ users }: TableViewContentProps) => {

	const userColumns = useMemo<ColumnDef<User>[]>(
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
				},
				enableSorting: true,
			},
			{
				id: "name",
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Name" label="Name" />
				),
				cell: ({ row }) => <div>{row.original.name}</div>,
				meta: {
					label: "Name",
					placeholder: "Search name...",
					variant: "text",
					icon: CaseSensitive,
				},
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				id: "email",
				accessorKey: "email",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Email" label="Email" />
				),
				cell: ({ row }) => <div>{row.original.email}</div>,
				meta: {
					label: "Email",
					placeholder: "Search email...",
					variant: "text",
					icon: Mail,
				},
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				id: "address",
				accessorKey: "address",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title="Address"
						label="Address"
					/>
				),
				cell: ({ row }) => (
					<div>
						{row.original.address.street}, {row.original.address.city}
					</div>
				),
				meta: {
					label: "Address",
					placeholder: "Search address...",
					variant: "text",
					icon: MapPinned,
				},
				enableColumnFilter: true,
				enableSorting: false,
			},
			{
				id: "phone",
				accessorKey: "phone",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Phone" label="Phone" />
				),
				cell: ({ row }) => <div>{row.original.phone}</div>,
				meta: {
					label: "Phone",
					placeholder: "Search phone...",
					variant: "text",
					icon: Phone,
				},
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				id: "website",
				accessorKey: "website",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title="Website"
						label="Website"
					/>
				),
				cell: ({ row }) => <div>{row.original.website}</div>,
				meta: {
					label: "Website",
					placeholder: "Search website...",
					variant: "text",
					icon: ExternalLink,
				},
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				id: "company",
				accessorKey: "company",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title="Company"
						label="Company"
					/>
				),
				cell: ({ row }) => <div>{row.original.company.name}</div>,
				meta: {
					label: "Company",
					placeholder: "Search company...",
					variant: "text",
					icon: Building2,
				},
				enableColumnFilter: true,
				enableSorting: false,
			},
		],
		[],
	);

	const { table } = useDataTable({
		data: users,
		columns: userColumns,
		pageCount: 1,
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 10,
			},
		},
		getRowId: (row) => row.id.toString(),
		enableClientSide: true,
	});

	return (
		<DataTable table={table}>
			<DataTableAdvancedToolbar table={table}>
				<DataTableFilterMenu table={table} />
				<DataTableSortList table={table} />
			</DataTableAdvancedToolbar>
		</DataTable>
	);
};
