import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error";
import { navigateAfterInvitationAccept } from "../helpers";
import { useInvitationMutations } from "../queries";
import type { TInvitation } from "../schemas";

interface IInvitationItemProps {
	invitation: TInvitation;
	onActionComplete: () => void;
}

export function InvitationItem({
	invitation,
	onActionComplete,
}: IInvitationItemProps) {
	const navigate = useNavigate();
	const { accept, decline } = useInvitationMutations();
	const targetName =
		invitation.project?.name || invitation.team?.name || "an organization";
	const targetType = invitation.project_id ? "project" : "team";

	return (
		<div className="flex flex-col gap-2 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
			<div className="flex justify-between items-start gap-2">
				<div className="flex flex-col gap-1">
					<p className="text-sm">
						<span className="font-semibold">
							{invitation.inviter?.name || "Someone"}
						</span>{" "}
						invited you to join the {targetType}{" "}
						<span className="font-semibold">{targetName}</span>
					</p>
					<p className="text-xs text-muted-foreground">
						{formatDistanceToNow(new Date(invitation.created_at), {
							addSuffix: true,
						})}
					</p>
				</div>
			</div>

			<div className="flex gap-2 mt-2">
				<Button
					size="sm"
					className="w-full flex-1 h-8"
					disabled={accept.isPending || decline.isPending}
					onClick={() => {
						accept.mutate(invitation.id, {
							onSuccess: (result) => {
								toast.success("Invitation accepted successfully");
								navigateAfterInvitationAccept(result, navigate);
								onActionComplete();
							},
							onError: (error) => {
								toast.error(
									getErrorMessage(error, "Failed to accept invitation"),
								);
							},
						});
					}}
				>
					{accept.isPending ? (
						<Loader2 className="size-3 animate-spin mr-1" />
					) : (
						<Check className="size-3 mr-1" />
					)}
					Accept
				</Button>
				<Button
					size="sm"
					variant="outline"
					className="w-full flex-1 h-8"
					disabled={accept.isPending || decline.isPending}
					onClick={() => {
						decline.mutate(invitation.id, {
							onSuccess: () => {
								toast.success("Invitation declined");
								onActionComplete();
							},
							onError: (error) => {
								toast.error(
									getErrorMessage(error, "Failed to decline invitation"),
								);
							},
						});
					}}
				>
					{decline.isPending ? (
						<Loader2 className="size-3 animate-spin mr-1" />
					) : (
						<X className="size-3 mr-1" />
					)}
					Decline
				</Button>
			</div>
		</div>
	);
}
