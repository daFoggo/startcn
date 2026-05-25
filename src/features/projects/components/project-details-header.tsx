import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, FolderOpen, Settings, Share2 } from "lucide-react";
import { MemberAvatarGroup } from "@/components/common/member-avatar-group";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TProjectMember } from "@/features/project-members";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { getProjectPermissions } from "../permissions";
import type { TProject } from "../schemas";

export interface IProjectDetailsHeaderProps {
	teamId: string;
	project: TProject | null;
	members: TProjectMember[];
	currentUser?: TUser;
	isMembersLoading?: boolean;
	isMembersError?: boolean;
	membersError?: unknown;
	onInviteMembers?: () => void;
}

export function ProjectDetailsHeader({
	teamId,
	project,
	members,
	currentUser,
	isMembersLoading = false,
	isMembersError = false,
	membersError,
	onInviteMembers,
}: IProjectDetailsHeaderProps) {
	const navigate = useNavigate();

	if (!project) {
		return (
			<div className="flex w-full items-center justify-between gap-4 py-2 text-destructive font-medium">
				Error loading project details
			</div>
		);
	}

	const permissions = getProjectPermissions({ members }, currentUser?.id);

	return (
		<div className="flex w-full items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<div className="rounded-md border bg-muted p-2">
					<FolderOpen className="size-4" />
				</div>

				<div className="flex items-center gap-2">
					<p className="text-xl font-semibold text-foreground">
						{project.name ?? "Unknown project"}
					</p>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() =>
									navigate({
										to: "/dashboard/$teamId/projects/$projectId/settings",
										params: { teamId, projectId: project.id },
									})
								}
								aria-label="Settings"
							>
								<Settings className="size-4 text-muted-foreground" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Settings</TooltipContent>
					</Tooltip>
				</div>
			</div>

			<div className="flex items-center gap-4">
				{isMembersLoading && <Skeleton className="h-8 w-24 rounded-full" />}

				{isMembersError && (
					<div className="flex items-center gap-1.5 text-xs text-destructive">
						<AlertCircle className="size-3.5 shrink-0" />
						<span className="truncate">
							{getErrorMessage(membersError, "Could not load members.")}
						</span>
					</div>
				)}

				{!isMembersLoading && !isMembersError && members.length > 0 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className="cursor-pointer transition-all"
								onClick={() =>
									navigate({
										to: "/dashboard/$teamId/projects/$projectId/settings/members",
										params: { teamId, projectId: project.id },
									})
								}
							>
								<MemberAvatarGroup
									items={members}
									max={4}
									size="default"
									getAvatarInfo={(m: TProjectMember) => ({
										id: m.id,
										name: m.user?.name,
										avatar_url: m.user?.avatar_url,
									})}
								/>
							</div>
						</TooltipTrigger>
						<TooltipContent>View all members</TooltipContent>
					</Tooltip>
				)}

				{permissions.canManageProject && (
					<Button onClick={onInviteMembers} className="gap-2">
						Share
						<Share2 className="size-4" />
					</Button>
				)}
			</div>
		</div>
	);
}
