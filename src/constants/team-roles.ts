import { Eye, ShieldCheck, ShieldUser, User } from "lucide-react";
import type { TTeamRole } from "@/features/team-members";
import type { ITeamRoleCatalogItem } from "@/types/team-roles";

export const TEAM_ROLE_CATALOG: ITeamRoleCatalogItem[] = [
	{
		value: "owner",
		label: "Owner",
		icon: ShieldCheck,
		variant: "outline",
		className:
			"border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 gap-1",
	},
	{
		value: "manager",
		label: "Manager",
		icon: ShieldUser,
		variant: "outline",
		className:
			"border-indigo-500/20 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 gap-1",
	},
	{
		value: "member",
		label: "Member",
		icon: User,
		variant: "secondary",
		className: "gap-1",
	},
	{
		value: "viewer",
		label: "Viewer",
		icon: Eye,
		variant: "outline",
		className: "gap-1",
	},
];

export const ASSIGNABLE_ROLES = TEAM_ROLE_CATALOG.filter(
	(r) => r.value !== "owner",
);
export function getTeamRoleOption(role: TTeamRole) {
	return TEAM_ROLE_CATALOG.find((r) => r.value === role);
}
