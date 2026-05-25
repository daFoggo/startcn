import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

interface ITeamDeleteDialogProps {
	isPending: boolean;
	isLastTeam?: boolean;
	onConfirm: () => Promise<boolean>;
}

export const TeamDeleteDialog = ({
	isPending,
	isLastTeam = false,
	onConfirm,
}: ITeamDeleteDialogProps) => {
	const [open, setOpen] = useState(false);

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
					<FieldLabel className="font-bold">Delete team</FieldLabel>
					<FieldDescription>
						Once you delete your team, there is no going back. This action
						cannot be undone.
					</FieldDescription>
				</div>

				<AlertDialog open={open} onOpenChange={setOpen}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" className="w-fit" size="lg">
							<Trash2 className="size-4" />
							<span>Delete Team</span>
						</Button>
					</AlertDialogTrigger>

					<AlertDialogContent className="sm:min-w-md">
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to delete this team?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. All team data and member access
								related to this team will be removed.
							</AlertDialogDescription>
						</AlertDialogHeader>

						{isLastTeam ? (
							<Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
								<AlertTriangle className="size-4" />
								<AlertTitle>You currently only have 1 team</AlertTitle>
								<AlertDescription>
									If you delete this team, you will need to create a new team
									right after this step to continue.
								</AlertDescription>
							</Alert>
						) : null}

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
									<span>Delete Team</span>
								)}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</FieldGroup>
		</div>
	);
};
