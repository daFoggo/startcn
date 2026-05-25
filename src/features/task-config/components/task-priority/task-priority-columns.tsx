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
import type { TTaskPriority } from "../../schemas";
import { DeleteTaskPriorityDialog } from "./delete-task-priority-dialog";
import { EditTaskPriorityDialog } from "./edit-task-priority-dialog";

const PriorityNameCell = ({ row }: CellContext<TTaskPriority, any>) => {
	const priority = row.original;
	return (
		<div className="flex items-center gap-2">
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: priority.color }}
			/>
			<span>{priority.name}</span>
		</div>
	);
};

const PriorityColorCell = ({ row }: CellContext<TTaskPriority, any>) => {
	const priority = row.original;
	return (
		<div className="flex items-center gap-2">
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: priority.color }}
			/>
			<span className="text-sm">{priority.color}</span>
		</div>
	);
};

const DefaultValueCell = ({ row }: CellContext<TTaskPriority, any>) => {
	const priority = row.original;
	return <span className="text-sm">{String(priority.is_default)}</span>;
};

const ActionCell = ({ row }: CellContext<TTaskPriority, any>) => {
	const priority = row.original;
	const { removePriority } = useTaskConfigMutations();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const handleDelete = async (): Promise<boolean> => {
		try {
			await removePriority.mutateAsync({
				projectId: priority.project_id,
				priorityId: priority.id,
			});
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete task priority"));
			console.error("Failed to delete task priority:", error);
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

			<EditTaskPriorityDialog
				priority={priority}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
			<DeleteTaskPriorityDialog
				priority={priority}
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				isPending={removePriority.isPending}
				onConfirm={handleDelete}
			/>
		</>
	);
};

export const taskPriorityColumns = generateColumns<TTaskPriority>([
	{
		accessorKey: "name",
		label: "Priority Name",
		size: 220,
		cell: (ctx) => <PriorityNameCell {...ctx} />,
	},
	{
		accessorKey: "level",
		label: "Level",
		size: 90,
		cell: ({ getValue }) => (
			<span className="text-sm">{String(getValue())}</span>
		),
	},
	{
		accessorKey: "color",
		label: "Color",
		size: 180,
		cell: (ctx) => <PriorityColorCell {...ctx} />,
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
