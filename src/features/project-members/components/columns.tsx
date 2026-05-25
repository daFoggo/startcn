import { useNavigate } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTeamRoleOption, TEAM_ROLE_CATALOG } from "@/constants/team-roles";
import { generateColumns } from "@/lib/data-table";
import { getErrorMessage } from "@/lib/error";
import { useProjectMemberMutations } from "../queries";
import type { TProjectMember } from "../schemas";

interface IProjectMemberColumnsOptions {
	currentUserId?: string;
	teamId?: string;
}

export const getProjectMemberColumns = ({
	currentUserId,
	teamId,
}: IProjectMemberColumnsOptions = {}) =>
	generateColumns<TProjectMember>([
		{
			id: "member",
			label: "Member",
			size: 200,
			cell: ({ row }) => {
				const member = row.original;
				return (
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={member.user?.avatar_url ?? undefined} />
							<AvatarFallback>
								{member.user?.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="font-medium">{member.user?.name}</span>
							<span className="text-xs text-muted-foreground">
								{member.user?.email}
							</span>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			label: "Role",
			size: 150,
			cell: RoleCell,
		},
		{
			accessorKey: "joined_at",
			label: "Joined At",
			size: 150,
			cell: ({ getValue }) => {
				const val = getValue() as string;
				return (
					<span className="text-sm text-muted-foreground">
						{val ? new Date(val).toLocaleDateString() : "N/A"}
					</span>
				);
			},
		},
		{
			id: "actions",
			label: "Actions",
			size: 60,
			isActionColumn: true,
			cell: (context) => (
				<ActionCell
					{...context}
					currentUserId={currentUserId}
					teamId={teamId}
				/>
			),
		},
	]);

export const projectMemberColumns = getProjectMemberColumns();

function RoleCell({ row }: CellContext<TProjectMember, any>) {
	const member = row.original;
	const { updateRole } = useProjectMemberMutations();
	const roleOption = getTeamRoleOption(member.role as any);

	if (!roleOption) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Badge
					variant={roleOption.variant as any}
					className={`cursor-pointer transition-colors ${roleOption.className}`}
				>
					<roleOption.icon className="size-3" />
					{roleOption.label}
					<ChevronDown className="size-3 opacity-50" />
				</Badge>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-40">
				<DropdownMenuLabel>Change Role</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{TEAM_ROLE_CATALOG.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
						className="gap-2"
						disabled={member.role === opt.value}
						onClick={() =>
							updateRole.mutate(
								{
									projectId: member.project_id,
									user_id: member.user_id,
									payload: { role: opt.value as any },
								},
								{
									onError: (error) => {
										toast.error(
											getErrorMessage(error, "Failed to update member role"),
										);
									},
								},
							)
						}
					>
						<opt.icon className="size-4" />
						{opt.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ActionCell({
	row,
	currentUserId,
	teamId,
}: CellContext<TProjectMember, any> & IProjectMemberColumnsOptions) {
	const member = row.original;
	const { removeMember } = useProjectMemberMutations();
	const isCurrentUser = currentUserId === member.user_id;

	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="size-8"
					aria-label="More options"
				>
					<MoreHorizontal className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					className="text-destructive focus:bg-destructive/10 focus:text-destructive"
					onClick={() =>
						removeMember.mutate(
							{
								projectId: member.project_id,
								user_id: member.user_id,
							},
							{
								onSuccess: () => {
									if (isCurrentUser) {
										if (teamId) {
											navigate({
												to: "/dashboard/$teamId/overview",
												params: { teamId },
											});
										} else {
											navigate({ to: "/dashboard" });
										}
									}
								},
								onError: (error) => {
									toast.error(
										getErrorMessage(error, "Failed to remove project member"),
									);
								},
							},
						)
					}
				>
					<UserMinus className="size-4" />
					{isCurrentUser ? "Leave Project" : "Remove from Project"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
