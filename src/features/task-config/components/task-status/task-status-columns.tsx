import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateColumns } from "@/lib/data-table";
import { getErrorMessage } from "@/lib/error";
import { useTaskConfigMutations } from "../../queries";
import type { TTaskStatus } from "../../schemas";
import { DeleteTaskStatusDialog } from "./delete-task-status-dialog";
import { EditTaskStatusDialog } from "./edit-task-status-dialog";

const StatusBadgeCell = ({ row }: CellContext<TTaskStatus, any>) => {
	const status = row.original;
	return (
		<div className="flex items-center gap-2">
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: status.color }}
				title={status.color}
			/>
			<span>{status.name}</span>
		</div>
	);
};

const DefaultValueCell = ({ row }: CellContext<TTaskStatus, any>) => {
	const status = row.original;
	return <span className="text-sm">{String(status.is_default)}</span>;
};

const CompletedValueCell = ({ row }: CellContext<TTaskStatus, any>) => {
	const status = row.original;
	return <span className="text-sm">{String(status.is_completed)}</span>;
};

const ActionCell = ({ row }: CellContext<TTaskStatus, any>) => {
	const status = row.original;
	const { removeStatus } = useTaskConfigMutations();

	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const handleDelete = async (): Promise<boolean> => {
		try {
			await removeStatus.mutateAsync({
				projectId: status.project_id,
				statusId: status.id,
			});
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete status"));
			console.error("Failed to delete status:", error);
			return false;
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreHorizontal className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setIsEditOpen(true)}
						className="gap-2 cursor-pointer"
					>
						<Pencil className="size-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsDeleteOpen(true)}
						className="gap-2 cursor-pointer text-destructive focus:text-destructive"
					>
						<Trash2 className="size-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<EditTaskStatusDialog
				status={status}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>

			<DeleteTaskStatusDialog
				status={status}
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				isPending={removeStatus.isPending}
				onConfirm={handleDelete}
			/>
		</>
	);
};

export const taskStatusColumns = generateColumns<TTaskStatus>([
	{
		accessorKey: "name",
		label: "Status Name",
		size: 250,
		cell: (ctx) => <StatusBadgeCell {...ctx} />,
	},
	{
		accessorKey: "order",
		label: "Order",
		size: 80,
		cell: ({ getValue }) => getValue(),
	},
	{
		accessorKey: "is_default",
		label: "Is Default",
		size: 100,
		cell: (ctx) => <DefaultValueCell {...ctx} />,
	},
	{
		accessorKey: "is_completed",
		label: "Is Completed",
		size: 100,
		cell: (ctx) => <CompletedValueCell {...ctx} />,
	},
	{
		id: "actions",
		label: "Actions",
		size: 100,
		cell: (ctx) => <ActionCell {...ctx} />,
	},
]);
