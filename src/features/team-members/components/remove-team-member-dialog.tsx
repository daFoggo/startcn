import { AlertTriangle, Loader2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import type { TTeamMember } from "../schemas";

interface IRemoveTeamMemberDialogProps {
	member: TTeamMember;
	projectCount: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending: boolean;
}

export const RemoveTeamMemberDialog = ({
	member,
	projectCount,
	open,
	onOpenChange,
	onConfirm,
	isPending,
}: IRemoveTeamMemberDialogProps) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="sm:min-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertTriangle className="size-5 text-destructive" />
						Confirm Removal
					</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div className="space-y-4 pt-2 text-sm text-muted-foreground">
							<p>
								Are you sure you want to remove{" "}
								<span className="font-semibold text-foreground">
									{member.user?.name}
								</span>{" "}
								from the team?
							</p>

							{projectCount > 0 && (
								<Alert
									variant="destructive"
									className="border-destructive/20 bg-destructive/5"
								>
									<AlertTriangle className="size-4" />
									<AlertTitle>Active Project Access Warning</AlertTitle>
									<AlertDescription>
										This user is currently a member of{" "}
										<span className="font-bold">
											{projectCount}{" "}
											{projectCount === 1 ? "project" : "projects"}
										</span>{" "}
										in this team. Removing them from the team will also revoke
										their access and remove their membership from all those
										projects.
									</AlertDescription>
								</Alert>
							)}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
						disabled={isPending}
					>
						{isPending ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								<span>Removing...</span>
							</>
						) : (
							"Confirm & Remove"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
