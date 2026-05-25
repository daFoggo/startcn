import { AlertCircle, Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MultiSelectCombobox } from "@/components/common/multi-select-combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ASSIGNABLE_ROLES } from "@/constants/team-roles";
import type { TUserSearchResult } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { useProjectMemberMutations } from "../queries";
import type { TProjectRole } from "../schemas";

interface IInviteProjectMemberDialogProps {
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	users: TUserSearchResult[];
	isUsersLoading?: boolean;
	isUsersError?: boolean;
	usersError?: unknown;
	onSearchQueryChange: (query: string) => void;
}

/**
 * Dialog xử lý việc mời thành viên mới vào Project.
 * Bao gồm tìm kiếm người dùng trong hệ thống (loại trừ những người đã tham gia) và chọn vai trò cho họ.
 */
export const InviteProjectMemberDialog = ({
	projectId,
	open,
	onOpenChange,
	users: fetchedUsers,
	isUsersLoading = false,
	isUsersError = false,
	usersError,
	onSearchQueryChange,
}: IInviteProjectMemberDialogProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<TUserSearchResult[]>([]);
	const [selectedRole, setSelectedRole] = useState<TProjectRole>("member");

	const users = useMemo(() => {
		if (isUsersError) return [];

		const list = [...(fetchedUsers ?? [])];
		const trimmedQuery = searchQuery.trim();
		const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedQuery);

		if (
			trimmedQuery &&
			isValidEmail &&
			!list.some((u) => u.email === trimmedQuery)
		) {
			list.push({
				id: `invite-${trimmedQuery}`,
				name: `Invite ${trimmedQuery}`,
				email: trimmedQuery,
			});
		}
		return list;
	}, [fetchedUsers, searchQuery, isUsersError]);

	const { generateInvite } = useProjectMemberMutations();

	const handleAdd = async () => {
		if (selectedUsers.length === 0) return;

		try {
			await Promise.all(
				selectedUsers.map((user) =>
					generateInvite.mutateAsync({
						projectId: projectId,
						payload: { email: user.email, role: selectedRole },
					}),
				),
			);
			toast.success(`${selectedUsers.length} invitations have been sent`);
			handleReset();
			onOpenChange(false);
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to send some invitations"));
		}
	};

	const handleReset = () => {
		setSearchQuery("");
		onSearchQueryChange("");
		setSelectedUsers([]);
		setSelectedRole("member");
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			handleReset();
		}
		onOpenChange(nextOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:min-w-md">
				<DialogHeader>
					<DialogTitle>Invite member</DialogTitle>
					<DialogDescription>
						Search by name or email to find and invite a user to your project.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<Field>
						<FieldLabel>Users</FieldLabel>
						<MultiSelectCombobox
							items={users}
							value={selectedUsers}
							onValueChange={(vals) => {
								setSelectedUsers(vals);
							}}
							onInputValueChange={(query) => {
								setSearchQuery(query);
								onSearchQueryChange(query);
							}}
							isLoading={isUsersLoading}
							itemToString={(user) => user.name}
							itemToValue={(user) => user.id}
							renderChip={(user) =>
								user.id.startsWith("invite-") ? user.email : user.name
							}
							placeholder="Search by name or email..."
							renderItem={(user) => (
								<div className="flex items-center gap-2">
									<Avatar className="size-6">
										<AvatarImage src={user.avatar_url ?? undefined} />
										<AvatarFallback>
											{user.id.startsWith("invite-")
												? "@"
												: user.name.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm font-medium">{user.name}</span>
										<span className="text-xs text-muted-foreground">
											{user.email}
										</span>
									</div>
								</div>
							)}
						/>
						{isUsersError && (
							<div className="flex items-center gap-1.5 text-xs text-destructive">
								<AlertCircle className="size-3.5 shrink-0" />
								<span>
									{getErrorMessage(usersError, "Could not search users.")}
								</span>
							</div>
						)}
					</Field>

					<Field>
						<FieldLabel>Role</FieldLabel>
						<Select
							value={selectedRole}
							onValueChange={(val) => setSelectedRole(val as TProjectRole)}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="p-1">
								{ASSIGNABLE_ROLES.map((role) => (
									<SelectItem key={role.value} value={role.value}>
										<div className="flex items-center gap-2">
											<role.icon className="size-3.5" />
											{role.label}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="ghost"
						onClick={() => handleOpenChange(false)}
						disabled={generateInvite.isPending}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleAdd}
						disabled={
							selectedUsers.length === 0 ||
							generateInvite.isPending ||
							isUsersError
						}
					>
						{generateInvite.isPending ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								<span>Sending...</span>
							</>
						) : (
							<>
								<Plus className="size-4" />
								<span>Invite Member</span>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
