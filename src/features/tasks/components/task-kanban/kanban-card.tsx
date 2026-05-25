import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { AlignLeft, Clock } from "lucide-react";
import { MemberAvatarGroup } from "@/components/common/member-avatar-group";
import { TaskTypeBadge } from "@/components/common/task-type-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TTask } from "../../schemas";

interface KanbanCardProps {
	task: TTask;
	onClick: () => void;
	onDelete?: () => void;
	isOverlay?: boolean;
	canDrag?: boolean;
}

export const KanbanCard = ({
	task,
	onClick,
	isOverlay,
	canDrag = true,
}: KanbanCardProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		disabled: isOverlay || !canDrag,
		data: {
			type: "card",
			task,
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging && !isOverlay ? 0.3 : 1,
		zIndex: isDragging && !isOverlay ? 50 : undefined,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...(isOverlay || !canDrag ? {} : attributes)}
			{...(isOverlay || !canDrag ? {} : listeners)}
			className={cn(
				"group relative",
				canDrag && !isOverlay
					? "cursor-grab active:cursor-grabbing"
					: "cursor-pointer",
			)}
			onClick={(e) => {
				if (isOverlay) return;
				e.stopPropagation();
				onClick();
			}}
		>
			<Card
				className={cn(
					"group/card relative overflow-hidden transition-all duration-200",
					isOverlay
						? "bg-background shadow-lg ring-1 ring-foreground/10"
						: "border-none! bg-muted shadow-none! ring-0! hover:bg-muted/70",
				)}
				size="sm"
			>
				<CardContent className="space-y-2">
					{/* Title */}
					<p className="line-clamp-2 text-sm leading-tight font-semibold group-hover:text-foreground">
						{task.title}
					</p>

					{/* Type/Category Badge */}
					{task.type && (
						<TaskTypeBadge
							name={typeof task.type === "object" ? task.type.name : task.type}
							color={
								typeof task.type === "object"
									? task.type.color
									: task.type_color
							}
						/>
					)}

					{/* Footer: Icons & Assignee */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs text-muted-foreground/60">
							{task.description && <AlignLeft className="size-3.5" />}
							{task.due_date && (
								<div className="flex items-center gap-1">
									<Clock className="size-3.5" />
									<span>{format(new Date(task.due_date), "do MMM")}</span>
								</div>
							)}
						</div>

						{task.task_members && task.task_members.length > 0 && (
							<MemberAvatarGroup
								items={task.task_members}
								max={2}
								size="sm"
								getAvatarInfo={(m) => ({
									id: m.user_id,
									name: m.user?.name,
									avatar_url: m.user?.avatar_url,
								})}
							/>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
