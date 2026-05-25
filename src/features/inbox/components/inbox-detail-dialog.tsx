import {
	Bookmark,
	BookmarkCheck,
	CheckCircle2,
	Clock,
	RotateCcw,
	Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TInboxItem } from "../schemas";
import { InboxContent } from "./inbox-content";

interface IInboxDetailDialogProps {
	item: TInboxItem;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	handleToggleRead: (e: React.MouseEvent) => void;
	handleToggleBookmark: (e: React.MouseEvent) => void;
	handleDelete: (e: React.MouseEvent) => void;
}

export const InboxDetailDialog = ({
	item,
	isOpen,
	setIsOpen,
	handleToggleRead,
	handleToggleBookmark,
	handleDelete,
}: IInboxDetailDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="overflow-hidden rounded-xl sm:max-w-150">
				<DialogHeader className="space-y-4 border-b pb-4">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 space-y-2">
							<div className="flex items-center gap-2">
								<Badge
									variant={item.type === "INVITATION" ? "default" : "secondary"}
								>
									{item.type}
								</Badge>
								<span className="flex items-center gap-1 text-xs text-muted-foreground">
									<Clock className="size-3" />
									{new Date(item.created_at).toLocaleString()}
								</span>
							</div>
							<DialogTitle className="text-2xl font-bold">
								{item.title}
							</DialogTitle>
						</div>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"rounded-md",
									item.status === "BOOKMARKED" &&
										"text-primary hover:text-primary",
								)}
								onClick={handleToggleBookmark}
								aria-label={
									item.status === "BOOKMARKED"
										? "Remove bookmark"
										: "Add bookmark"
								}
							>
								{item.status === "BOOKMARKED" ? (
									<BookmarkCheck className="size-4" />
								) : (
									<Bookmark className="size-4" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"rounded-md",
									item.status === "ARCHIVED" &&
										"text-primary hover:text-primary",
								)}
								onClick={handleToggleRead}
								aria-label={
									item.status === "ACTIVE" ? "Mark as read" : "Mark as unread"
								}
							>
								{item.status === "ACTIVE" ? (
									<CheckCircle2 className="size-4" />
								) : (
									<RotateCcw className="size-4" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-md hover:text-destructive"
								onClick={handleDelete}
								aria-label="Delete"
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-6 overflow-y-auto">
					<DialogDescription className="prose prose-sm dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap">
						{item.content}
					</DialogDescription>
					<InboxContent item={item} />
				</div>

				<DialogFooter>
					<Button variant="secondary" onClick={() => setIsOpen(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
