import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { ChevronDown, Loader2, MoreHorizontal, UserMinus } from "lucide-react";
import { useState } from "react";
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
import { useDashboardStore } from "@/stores/use-dashboard-store";
import {
	memberProjectCountQueryOptions,
	useTeamMemberMutations,
} from "../queries";
import type { TTeamMember } from "../schemas";
import { RemoveTeamMemberDialog } from "./remove-team-member-dialog";

interface ITeamMemberColumnsOptions {
	members: TTeamMember[];
	currentUserId?: string;
}

const RoleCell = ({
	row,
	members,
	currentUserId,
}: CellContext<TTeamMember, any> & ITeamMemberColumnsOptions) => {
	const member = row.original;
	const { updateRole } = useTeamMemberMutations();

	const roleOption = getTeamRoleOption(member.role);

	if (!roleOption) return null;

	const currentUserRole = members.find(
		(m) => m.user_id === currentUserId,
	)?.role;
	const ownerCount =
		members.filter((teamMember) => teamMember.role === "owner").length ?? 0;
	const isCurrentUser = currentUserId === member.user_id;
	const canManageOwnerRole = currentUserRole === "owner";
	const isProtectedOwnerRole =
		member.role === "owner" &&
		(isCurrentUser || !canManageOwnerRole || ownerCount <= 1);

	if (
		(currentUserRole !== "owner" && currentUserRole !== "manager") ||
		isProtectedOwnerRole
	) {
		return (
			<Badge variant={roleOption.variant} className={`${roleOption.className}`}>
				<roleOption.icon className="mr-1 size-3" />
				{roleOption.label}
			</Badge>
		);
	}

	const roleOptions = canManageOwnerRole
		? TEAM_ROLE_CATALOG
		: TEAM_ROLE_CATALOG.filter((opt) => opt.value !== "owner");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Badge
					variant={roleOption.variant}
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
				{roleOptions.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
						className="gap-2"
						disabled={member.role === opt.value}
						onClick={() =>
							updateRole.mutate(
								{
									teamId: member.team_id,
									user_id: member.user_id,
									payload: { role: opt.value },
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
};

const ActionCell = ({
	row,
	members,
	currentUserId,
}: CellContext<TTeamMember, any> & ITeamMemberColumnsOptions) => {
	const member = row.original;
	const { removeMember } = useTeamMemberMutations();
	const queryClient = useQueryClient();

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [projectCount, setProjectCount] = useState<number>(0);
	const [isChecking, setIsChecking] = useState(false);

	const isCurrentUser = currentUserId === member.user_id;

	const navigate = useNavigate();

	const currentUserRole = members.find(
		(m) => m.user_id === currentUserId,
	)?.role;
	const ownerCount =
		members.filter((teamMember) => teamMember.role === "owner").length ?? 0;

	if (currentUserRole !== "owner" && currentUserRole !== "manager") {
		return null;
	}

	if (
		member.role === "owner" &&
		(currentUserRole !== "owner" || ownerCount <= 1)
	) {
		return null;
	}

	const handleRemoveClick = async () => {
		setIsChecking(true);
		try {
			const options = memberProjectCountQueryOptions(
				member.team_id,
				member.user_id,
			);
			await queryClient.invalidateQueries({ queryKey: options.queryKey });
			const count = await queryClient.fetchQuery(options);
			setProjectCount(count);
			setIsConfirmOpen(true);
		} catch (_error) {
			setIsConfirmOpen(true);
		} finally {
			setIsChecking(false);
		}
	};

	const handleConfirmRemove = () => {
		removeMember.mutate(
			{
				teamId: member.team_id,
				user_id: member.user_id,
			},
			{
				onSuccess: () => {
					setIsConfirmOpen(false);
					if (isCurrentUser) {
						const store = useDashboardStore.getState();
						if (store.last_team_id === member.team_id) {
							store.reset();
						}
						navigate({ to: "/dashboard" });
					}
				},
				onError: (error) => {
					toast.error(getErrorMessage(error, "Failed to remove team member"));
				},
			},
		);
	};

	return (
		<>
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
						disabled={isChecking}
						onClick={handleRemoveClick}
					>
						{isChecking ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<UserMinus className="size-4" />
						)}
						{isCurrentUser ? "Leave Team" : "Remove from Team"}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<RemoveTeamMemberDialog
				member={member}
				projectCount={projectCount}
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				onConfirm={handleConfirmRemove}
				isPending={removeMember.isPending}
			/>
		</>
	);
};

export const getTeamMemberColumns = ({
	members,
	currentUserId,
}: ITeamMemberColumnsOptions) =>
	generateColumns<TTeamMember>([
		{
			id: "member",
			label: "Member",
			size: 200,
			cell: ({ row }) => {
				const member = row.original;
				return (
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={member.user?.avatar_url} />
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
			cell: (context) => (
				<RoleCell
					{...context}
					members={members}
					currentUserId={currentUserId}
				/>
			),
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
					members={members}
					currentUserId={currentUserId}
				/>
			),
		},
	]);
