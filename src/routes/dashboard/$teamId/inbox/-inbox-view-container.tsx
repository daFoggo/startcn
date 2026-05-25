import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	InboxView,
	type TInboxItem,
	useInboxMutations,
} from "@/features/inbox";
import {
	navigateAfterInvitationAccept,
	useInvitationMutations,
} from "@/features/invitations";
import { getErrorMessage } from "@/lib/error";

interface IInboxViewContainerProps {
	items: TInboxItem[];
}

export function InboxViewContainer({ items }: IInboxViewContainerProps) {
	const navigate = useNavigate();
	const { markAsRead } = useInboxMutations();
	const { accept: acceptInvitation } = useInvitationMutations();

	const handleAcceptInvitation = (item: TInboxItem) => {
		if (!item.resource_id) return;

		acceptInvitation.mutate(item.resource_id, {
			onSuccess: (result) => {
				toast.success("Invitation accepted successfully");
				navigateAfterInvitationAccept(result, navigate);
				markAsRead.mutate(item.id);
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to accept invitation"));
			},
		});
	};

	return (
		<InboxView
			items={items}
			isAcceptingInvitation={acceptInvitation.isPending}
			onAcceptInvitation={handleAcceptInvitation}
		/>
	);
}
