import { formatDistanceToNow } from "date-fns";
import {
	Bookmark,
	BookmarkCheck,
	CheckCircle2,
	Circle,
	FolderClosed,
	Trash2,
	Users,
} from "lucide-react";
import { TaskTypeBadge } from "@/components/common/task-type-badge";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useInboxStore } from "@/stores/use-inbox-store";
import { useInboxMutations } from "../queries";
import type { TInboxItem, TInboxType } from "../schemas";
import { InboxActionButton } from "./inbox-action-button";

const TYPE_CONFIG: Record<TInboxType, { label: string; className: string }> = {
	INVITATION: {
		label: "Invitation",
		className: "border-primary/20 bg-primary/10 text-primary",
	},
	TASK_ASSIGNED: {
		label: "Task",
		className: "border-primary/20 bg-primary/10 text-primary",
	},
	PROJECT_UPDATE: {
		label: "Project",
		className: "border-primary/20 bg-primary/10 text-primary",
	},
	SYSTEM: {
		label: "System",
		className: "border-border bg-muted text-muted-foreground",
	},
};

interface IInboxItemProps {
	item: TInboxItem;
	isSelected?: boolean;
}

export const InboxItem = ({ item, isSelected }: IInboxItemProps) => {
	const { setSelectedItemId } = useInboxStore();
	const { markAsRead, unarchive, toggleBookmark, remove } = useInboxMutations();

	const handleToggleRead = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (item.status === "ACTIVE") {
			markAsRead.mutate(item.id);
		} else {
			unarchive.mutate(item.id);
		}
	};

	const handleToggleBookmark = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleBookmark.mutate(item.id);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		remove.mutate(item.id);
	};

	return (
		<TooltipProvider>
			<Card
				onClick={() => setSelectedItemId(item.id)}
				className={cn(
					"group relative cursor-pointer transition-all hover:bg-accent/50",
					item.status === "ACTIVE" && "bg-muted/40",
					isSelected && "ring-primary ring-offset-0",
				)}
				size="sm"
			>
				<CardHeader className="pb-0">
					<CardTitle
						className={cn(
							"line-clamp-1 flex items-center gap-2",
							item.status === "ACTIVE"
								? "text-foreground"
								: "text-muted-foreground/80",
						)}
					>
						{item.status === "ACTIVE" && (
							<span className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
						)}
						{item.title}
					</CardTitle>
					<CardAction className="opacity-0 transition-opacity group-hover:opacity-100">
						<div className="flex items-center gap-1">
							<InboxActionButton
								icon={item.status === "BOOKMARKED" ? BookmarkCheck : Bookmark}
								tooltip={
									item.status === "BOOKMARKED" ? "Remove bookmark" : "Bookmark"
								}
								onClick={handleToggleBookmark}
								className={cn(
									item.status === "BOOKMARKED" &&
										"text-primary hover:text-primary",
								)}
							/>
							<InboxActionButton
								icon={item.status === "ACTIVE" ? CheckCircle2 : Circle}
								tooltip={
									item.status === "ACTIVE" ? "Mark as read" : "Mark as unread"
								}
								onClick={handleToggleRead}
								className={cn(
									item.status === "ARCHIVED" &&
										"text-primary hover:text-primary",
								)}
							/>
							<InboxActionButton
								icon={Trash2}
								tooltip="Delete"
								onClick={handleDelete}
								className="hover:text-destructive"
							/>
						</div>
					</CardAction>
					<CardDescription className="col-span-full line-clamp-2 w-full text-xs leading-relaxed">
						{item.content?.substring(0, 300)}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{item.type === "TASK_ASSIGNED" ? (
						<TaskTypeBadge name="Task" color="#3b82f6" />
					) : (
						<Badge
							variant="outline"
							className={cn(
								"text-xs font-semibold",
								TYPE_CONFIG[item.type]?.className,
							)}
						>
							{TYPE_CONFIG[item.type]?.label ?? item.type}
						</Badge>
					)}
				</CardContent>

				<CardFooter className="flex flex-col items-start gap-1.5 border-none bg-transparent">
					<div className="flex w-full items-center justify-between">
						{item.type === "TASK_ASSIGNED" && item.data && (
							<div className="flex w-full flex-wrap items-center gap-1.5">
								{item.data.project_name && (
									<span className="flex items-center gap-1 text-xs text-muted-foreground">
										<FolderClosed className="size-3" />
										<span className="max-w-24 truncate font-medium">
											{item.data.project_name as string}
										</span>
									</span>
								)}
								{item.data.team_name && (
									<span className="flex items-center gap-1 text-xs text-muted-foreground">
										<span className="text-muted-foreground/40">·</span>
										<Users className="size-3" />
										<span className="max-w-24 truncate font-medium">
											{item.data.team_name as string}
										</span>
									</span>
								)}
							</div>
						)}
						<span className="shrink-0 text-xs font-medium text-muted-foreground/60">
							{formatDistanceToNow(new Date(item.created_at), {
								addSuffix: true,
							})}
						</span>
					</div>
				</CardFooter>
			</Card>
		</TooltipProvider>
	);
};
