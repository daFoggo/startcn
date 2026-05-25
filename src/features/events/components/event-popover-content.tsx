import { Link, useParams } from "@tanstack/react-router";
import {
	Edit2,
	ExternalLink,
	FileText,
	Tag,
	Trash2,
	Users,
} from "lucide-react";
import { MemberAvatarGroup } from "@/components/common/member-avatar-group";
import { Button } from "@/components/ui/button";
import type { IBigCalendarEvent } from "@/types/big-calendar";
import { EventTypeBadge } from "./event-type-badge";

interface IEventPopoverContentProps {
	event: IBigCalendarEvent;
	onEditClick?: (event: IBigCalendarEvent) => void;
	onDeleteClick?: (event: IBigCalendarEvent) => void;
}

export function EventPopoverContent({
	event,
	onEditClick,
	onDeleteClick,
}: IEventPopoverContentProps) {
	const params = useParams({ from: "/dashboard/$teamId/schedules/" });
	const isTask = event.meta?.type === "task";
	const projectId = event.meta?.project_id as string;
	return (
		<div className="flex flex-col gap-3">
			{/* Type Badge */}
			{Boolean(event.meta?.type) && (
				<div className="flex items-center gap-2">
					<Tag className="size-3.5 text-muted-foreground" />
					<EventTypeBadge type={String(event.meta?.type)} />
				</div>
			)}

			{/* Description */}
			{Boolean(event.meta?.description) && (
				<div className="flex items-start gap-2">
					<FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
					<p className="text-xs leading-relaxed text-muted-foreground">
						{String(event.meta?.description)}
					</p>
				</div>
			)}

			{/* Participants */}
			{Boolean(
				event.meta?.participants &&
					(event.meta.participants as any[]).length > 0,
			) && (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Users className="size-3.5" />
						<span className="text-xs font-medium">
							{isTask ? "Assignees" : "Participants"}
						</span>
					</div>
					<MemberAvatarGroup
						items={event.meta?.participants as any[]}
						max={5}
						size="sm"
						getAvatarInfo={(member) => ({
							id: member.user_id,
							name: member.user?.name,
							avatar_url: member.user?.avatar_url,
						})}
					/>
				</div>
			)}

			{/* Action buttons */}
			<div className="flex justify-end gap-2">
				{isTask ? (
					<Button variant="outline" size="sm" className="gap-2" asChild>
						<Link
							to="/dashboard/$teamId/projects/$projectId/tasks/$taskId"
							params={{
								teamId: params.teamId,
								projectId: projectId,
								taskId: String(event.id),
							}}
						>
							<ExternalLink className="size-3.5" />
							<span>View task details</span>
						</Link>
					</Button>
				) : (
					<>
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-destructive hover:bg-destructive hover:text-destructive"
							onClick={() => onDeleteClick?.(event)}
						>
							<Trash2 className="size-3.5" />
							<span>Delete</span>
						</Button>
						<Button
							variant="secondary"
							size="sm"
							className="gap-2"
							onClick={() => onEditClick?.(event)}
						>
							<Edit2 className="size-3.5" />
							<span>Edit</span>
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
