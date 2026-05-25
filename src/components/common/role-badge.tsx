import { Badge } from "@/components/ui/badge";
import { getTeamRoleOption } from "@/constants/team-roles";
import type { TTeamRole } from "@/features/team-members";

interface IRoleBadgeProps {
	role: TTeamRole;
	className?: string;
}

/**
 * Reusable component hiển thị nhãn (badge) đi kèm icon cho các vai trò (role) trong hệ thống.
 * Tự động ánh xạ từ role value sang giao diện (màu sắc, icon, label) dựa trên constants.
 */
export function RoleBadge({ role, className }: IRoleBadgeProps) {
	const option = getTeamRoleOption(role);
	if (!option) return null;

	return (
		<Badge
			variant={option.variant}
			className={`${option.className} ${className ?? ""}`}
		>
			<option.icon className="size-3" />
			{option.label}
		</Badge>
	);
}
