import { AlertCircle, UserPlus, Users } from "lucide-react";
import { MemberAvatarGroup } from "@/components/common/member-avatar-group";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TTeamMember } from "@/features/team-members";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { getTeamPermissions } from "../permissions";
import type { TTeam } from "../schemas";

export interface ITeamDetailsHeaderProps {
	team: TTeam | null;
	members: TTeamMember[];
	currentUser?: TUser;
	isMembersLoading?: boolean;
	isMembersError?: boolean;
	membersError?: unknown;
	isCurrentUserLoading?: boolean;
	isCurrentUserError?: boolean;
	currentUserError?: unknown;
	onInviteMembers?: () => void;
}

export function TeamDetailsHeader({
	team,
	members,
	currentUser,
	isMembersLoading = false,
	isMembersError = false,
	membersError,
	isCurrentUserLoading = false,
	isCurrentUserError = false,
	currentUserError,
	onInviteMembers,
}: ITeamDetailsHeaderProps) {
	if (!team) {
		return (
			<div className="flex w-full items-center justify-between gap-4 py-2 text-destructive">
				Error loading team details
			</div>
		);
	}

	const permissions = getTeamPermissions(members, currentUser?.id);
	const isPermissionLoading = isMembersLoading || isCurrentUserLoading;
	const isPermissionError = isMembersError || isCurrentUserError;

	return (
		<div className="flex w-full items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<div className="rounded-md border bg-muted p-2">
					<Users className="size-4" />
				</div>

				<p className="text-xl font-semibold text-foreground">
					{team.name ?? "Unknown team"}
				</p>
			</div>

			<div className="flex items-center gap-2">
				{isMembersLoading && <Skeleton className="h-8 w-24 rounded-full" />}

				{isMembersError && (
					<div className="flex items-center gap-1.5 text-xs text-destructive">
						<AlertCircle className="size-3.5 shrink-0" />
						<span className="truncate">
							{getErrorMessage(membersError, "Could not load members.")}
						</span>
					</div>
				)}

				{!isMembersLoading && !isMembersError && (
					<MemberAvatarGroup
						items={members}
						max={4}
						size="default"
						getAvatarInfo={(m: TTeamMember) => ({
							id: m.id,
							name: m.user?.name,
							avatar_url: m.user?.avatar_url,
						})}
					/>
				)}

				{isCurrentUserError && !isMembersError && (
					<div className="flex items-center gap-1.5 text-xs text-destructive">
						<AlertCircle className="size-3.5 shrink-0" />
						<span className="truncate">
							{getErrorMessage(currentUserError, "Could not load permissions.")}
						</span>
					</div>
				)}

				{isPermissionLoading && !isPermissionError && (
					<Skeleton className="h-9 w-20 rounded-md" />
				)}

				{permissions.canManageMembers &&
					!isPermissionLoading &&
					!isPermissionError && (
						<Button onClick={onInviteMembers}>
							Invite
							<UserPlus />
						</Button>
					)}
			</div>
		</div>
	);
}
