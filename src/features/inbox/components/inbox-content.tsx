import type { TInboxItem } from "../schemas";
import { InboxInvitationContent } from "./inbox-invitation-content";
import { InboxSystemContent } from "./inbox-system-content";
import { InboxTaskAssignedContent } from "./inbox-task-assigned-content";

interface IInboxContentProps {
	item: TInboxItem;
	isAcceptingInvitation?: boolean;
	onAcceptInvitation?: (item: TInboxItem) => void;
}

export const InboxContent = ({
	item,
	isAcceptingInvitation,
	onAcceptInvitation,
}: IInboxContentProps) => {
	switch (item.type) {
		case "INVITATION":
			return (
				<InboxInvitationContent
					item={item}
					isAcceptingInvitation={isAcceptingInvitation}
					onAcceptInvitation={onAcceptInvitation}
				/>
			);
		case "TASK_ASSIGNED":
			return <InboxTaskAssignedContent item={item} />;
		default:
			return <InboxSystemContent item={item} />;
	}
};
