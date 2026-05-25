import { Loader2, Trash2 } from "lucide-react";
import * as React from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";

interface IProjectDeleteDialogProps {
	isPending: boolean;
	onConfirm: () => Promise<boolean>;
}

export const ProjectDeleteDialog = ({
	isPending,
	onConfirm,
}: IProjectDeleteDialogProps) => {
	const [open, setOpen] = React.useState(false);

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
		<div className="max-w-xl">
			<FieldGroup className="gap-4">
				<div className="space-y-1">
					<FieldLabel className="font-bold">Delete project</FieldLabel>
					<FieldDescription>
						Once you delete your project, there is no going back. This action
						cannot be undone. All project data, tasks, and settings will be
						permanently removed.
					</FieldDescription>
				</div>

				<AlertDialog open={open} onOpenChange={setOpen}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" className="w-fit" size="lg">
							<Trash2 className="size-4" />
							<span>Delete Project</span>
						</Button>
					</AlertDialogTrigger>

					<AlertDialogContent className="sm:min-w-md">
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to delete this project?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. All data related to this project
								will be permanently removed.
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
									<span>Delete Project</span>
								)}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</FieldGroup>
		</div>
	);
};
