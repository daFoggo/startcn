import type { CellContext } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskTagBadge } from "@/components/common/task-tag-badge";
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
import type { TTaskTag } from "../../schemas";
import { DeleteTaskTagDialog } from "./delete-task-tag-dialog";
import { EditTaskTagDialog } from "./edit-task-tag-dialog";

const TagNameCell = ({ row }: CellContext<TTaskTag, any>) => {
	const tag = row.original;
	return (
		<div className="flex items-center gap-2">
			<TaskTagBadge name={tag.name} color={tag.color} tagVariant="subtle" />
		</div>
	);
};

const TagColorCell = ({ row }: CellContext<TTaskTag, any>) => {
	const tag = row.original;
	return (
		<div className="flex items-center gap-2">
			<div
				className="size-3 rounded-full"
				style={{ backgroundColor: tag.color }}
			/>
			<span className="text-sm">{tag.color}</span>
		</div>
	);
};

const ActionCell = ({ row }: CellContext<TTaskTag, any>) => {
	const tag = row.original;
	const { removeTag } = useTaskConfigMutations();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const handleDelete = async (): Promise<boolean> => {
		try {
			await removeTag.mutateAsync({
				projectId: tag.project_id,
				tagId: tag.id,
			});
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete task tag"));
			console.error("Failed to delete task tag:", error);
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

			<EditTaskTagDialog
				tag={tag}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
			<DeleteTaskTagDialog
				tag={tag}
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				isPending={removeTag.isPending}
				onConfirm={handleDelete}
			/>
		</>
	);
};

export const taskTagColumns = generateColumns<TTaskTag>([
	{
		accessorKey: "name",
		label: "Tag Name",
		size: 220,
		cell: (ctx) => <TagNameCell {...ctx} />,
	},
	{
		accessorKey: "color",
		label: "Color",
		size: 180,
		cell: (ctx) => <TagColorCell {...ctx} />,
	},
	{
		id: "actions",
		label: "Actions",
		size: 100,
		cell: (ctx) => <ActionCell {...ctx} />,
	},
]);
