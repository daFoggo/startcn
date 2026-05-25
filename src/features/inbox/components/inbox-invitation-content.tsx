import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TInboxItem } from "../schemas";

interface IInboxInvitationContentProps {
	item: TInboxItem;
	isAcceptingInvitation?: boolean;
	onAcceptInvitation?: (item: TInboxItem) => void;
}

export const InboxInvitationContent = ({
	item,
	isAcceptingInvitation = false,
	onAcceptInvitation,
}: IInboxInvitationContentProps) => {
	const handleAccept = (e: React.MouseEvent) => {
		e.stopPropagation();
		onAcceptInvitation?.(item);
	};

	return (
		<Card className="border-primary/20 bg-primary/5" size="sm">
			<CardHeader className="text-center">
				<div className="mb-2 flex justify-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
						<UserPlus className="size-6" />
					</div>
				</div>
				<CardTitle>Project Invitation</CardTitle>
				<CardDescription>
					You have been invited to join a project.
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex justify-center">
				<Button
					onClick={handleAccept}
					className="w-full"
					disabled={!item.resource_id || isAcceptingInvitation}
				>
					Accept Invitation
				</Button>
			</CardFooter>
		</Card>
	);
};
