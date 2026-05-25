import { useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TInboxItem } from "../schemas";

interface IInboxTaskAssignedContentProps {
	item: TInboxItem;
}

export const InboxTaskAssignedContent = ({
	item,
}: IInboxTaskAssignedContentProps) => {
	const navigate = useNavigate();
	const data = item.data ?? {};

	const projectId = data.project_id as string | undefined;
	const teamId = data.team_id as string | undefined;

	const handleViewInBoard = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (teamId && projectId) {
			navigate({
				to: "/dashboard/$teamId/projects/$projectId/board",
				params: { teamId, projectId },
			});
		}
	};

	if (!teamId || !projectId) return null;

	return (
		<div className="pt-2">
			<Button
				variant="outline"
				size="sm"
				className="gap-2 border-primary/20 bg-primary/5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
				onClick={handleViewInBoard}
			>
				<ExternalLink className="size-3.5" />
				View in Board
			</Button>
		</div>
	);
};
