import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { getErrorMessage } from "@/lib/error";
import type { IBigCalendarEvent } from "@/types/big-calendar";
import { useEventMutations } from "../queries";

interface IDeleteEventDialogProps {
	event: IBigCalendarEvent | null;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSuccess?: () => void;
}

export const DeleteEventDialog = ({
	event,
	open: controlledOpen,
	onOpenChange: onControlledOpenChange,
	onSuccess,
}: IDeleteEventDialogProps) => {
	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled
		? onControlledOpenChange || (() => {})
		: setInternalOpen;

	const { remove } = useEventMutations();

	const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!event) return;

		remove.mutate(event.id, {
			onSuccess: () => {
				toast.success("Event deleted successfully");
				setOpen(false);
				onSuccess?.();
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to delete event"));
			},
		});
	};

	if (!event) return null;

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Event</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete "{event.title}"? This action cannot
						be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={remove.isPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={remove.isPending}
						onClick={handleConfirm}
					>
						{remove.isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
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
