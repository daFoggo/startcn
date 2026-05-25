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
import type { TTaskType } from "../../schemas";
import { DeleteTaskTypeDialog } from "./delete-task-type-dialog";
import { EditTaskTypeDialog } from "./edit-task-type-dialog";

const TypeNameCell = ({ row }: CellContext<TTaskType, any>) => {
	const type = row.original;
	return (
		<div className="flex items-center gap-2">
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: type.color }}
			/>
			<span>{type.name}</span>
		</div>
	);
};

const TypeColorCell = ({ row }: CellContext<TTaskType, any>) => {
	const type = row.original;
	return (
		<div className="flex items-center gap-2">
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: type.color }}
			/>
			<span className="text-sm">{type.color}</span>
		</div>
	);
};

const DefaultValueCell = ({ row }: CellContext<TTaskType, any>) => {
	const type = row.original;
	return <span className="text-sm">{String(type.is_default)}</span>;
};

const ActionCell = ({ row }: CellContext<TTaskType, any>) => {
	const type = row.original;
	const { removeType } = useTaskConfigMutations();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const handleDelete = async (): Promise<boolean> => {
		try {
			await removeType.mutateAsync({
				projectId: type.project_id,
				typeId: type.id,
			});
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete task type"));
			console.error("Failed to delete task type:", error);
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

			<EditTaskTypeDialog
				status={type}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
			<DeleteTaskTypeDialog
				status={type}
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				isPending={removeType.isPending}
				onConfirm={handleDelete}
			/>
		</>
	);
};

export const taskTypeColumns = generateColumns<TTaskType>([
	{
		accessorKey: "name",
		label: "Type Name",
		size: 220,
		cell: (ctx) => <TypeNameCell {...ctx} />,
	},
	{
		accessorKey: "icon",
		label: "Icon",
		size: 120,
		cell: ({ getValue }) => (
			<span className="text-sm">{String(getValue())}</span>
		),
	},
	{
		accessorKey: "color",
		label: "Color",
		size: 180,
		cell: (ctx) => <TypeColorCell {...ctx} />,
	},
	{
		accessorKey: "order",
		label: "Order",
		size: 80,
		cell: ({ getValue }) => (
			<span className="text-sm">{String(getValue())}</span>
		),
	},
	{
		accessorKey: "is_default",
		label: "Is Default",
		size: 100,
		cell: (ctx) => <DefaultValueCell {...ctx} />,
	},
	{
		id: "actions",
		label: "Actions",
		size: 100,
		cell: (ctx) => <ActionCell {...ctx} />,
	},
]);
