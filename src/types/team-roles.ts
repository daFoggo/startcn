import type { LucideIcon } from "lucide-react";
import type { TTeamRole } from "@/features/team-members";

export interface ITeamRoleCatalogItem {
	value: TTeamRole;
	label: string;
	icon: LucideIcon;
	variant: "default" | "secondary" | "outline" | "destructive";
	className: string;
}
