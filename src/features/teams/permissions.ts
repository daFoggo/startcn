import type { TTeamMember, TTeamRole } from "@/features/team-members";

export interface TeamPermissions {
	role: TTeamRole | null;
	canReadTeam: boolean;
	canManageTeam: boolean;
	canManageMembers: boolean;
	canManageOwnerRole: boolean;
	canCreateProjects: boolean;
}

export function getTeamRole(
	members: TTeamMember[] | undefined,
	userId: string | undefined,
): TTeamRole | null {
	if (!members || !userId) return null;
	return members.find((member) => member.user_id === userId)?.role ?? null;
}

export function getTeamPermissions(
	members: TTeamMember[] | undefined,
	userId: string | undefined,
): TeamPermissions {
	const role = getTeamRole(members, userId);

	return {
		role,
		canReadTeam:
			role === "owner" ||
			role === "manager" ||
			role === "member" ||
			role === "viewer",
		canManageTeam: role === "owner",
		canManageMembers: role === "owner" || role === "manager",
		canManageOwnerRole: role === "owner",
		canCreateProjects: role === "owner" || role === "manager",
	};
}
