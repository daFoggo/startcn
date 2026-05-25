import { Loader2 } from "lucide-react";
import { useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { TTaskStatus } from "../../schemas";

interface IDeleteTaskStatusDialogProps {
	status: TTaskStatus;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	isPending?: boolean;
	onConfirm: () => Promise<boolean>;
}

export const DeleteTaskStatusDialog = ({
	status,
	open: controlledOpen,
	onOpenChange: onControlledOpenChange,
	isPending = false,
	onConfirm,
}: IDeleteTaskStatusDialogProps) => {
	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled
		? onControlledOpenChange || (() => {})
		: setInternalOpen;

	const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (isPending) {
			return;
		}

		const isSuccess = await onConfirm();

		if (isSuccess) {
			setOpen(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete task status</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete "{status.name}"? This action cannot
						be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isPending}
						onClick={handleConfirm}
					>
						{isPending ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								<span>Deleting...</span>
							</>
						) : (
							<span>Delete</span>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
