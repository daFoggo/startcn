import type { TProjectRole } from "@/features/project-members";
import type { TProject } from "./schemas";

export type TProjectPermissionSet = {
	role: TProjectRole | null;
	canReadProject: boolean;
	canManageTasks: boolean;
	canManageProject: boolean;
};

export const getProjectRole = (
	project: Pick<TProject, "members"> | undefined | null,
	userId: string | undefined,
): TProjectRole | null => {
	if (!project || !userId) return null;
	return (project.members?.find((member) => member.user_id === userId)?.role ??
		null) as TProjectRole | null;
};

export const getProjectPermissions = (
	project: Pick<TProject, "members"> | undefined | null,
	userId: string | undefined,
): TProjectPermissionSet => {
	const role = getProjectRole(project, userId);

	return {
		role,
		canReadProject:
			role === "owner" ||
			role === "manager" ||
			role === "member" ||
			role === "viewer",
		canManageTasks: role === "owner" || role === "manager" || role === "member",
		canManageProject: role === "owner" || role === "manager",
	};
};
