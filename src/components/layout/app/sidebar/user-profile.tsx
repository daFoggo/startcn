import {
	IconSelector as ChevronsUpDown,
	IconLoader2 as Loader2,
	IconLogout as LogOut,
	IconUserSquareRounded as SquareUserRound,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";

interface IUserProfileProps {
	user?: TUser;
	logoutMutation: {
		mutateAsync: () => Promise<void>;
		isPending: boolean;
	};
}

export const UserProfile = ({ user, logoutMutation }: IUserProfileProps) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutMutation.mutateAsync();
			const { deleteAuthToken } = await import("@/lib/auth-token");
			await deleteAuthToken();

			toast.success("Logged out successfully");
			navigate({ to: "/auth/sign-in" });
		} catch (error) {
			toast.error(getErrorMessage(error, "Logout failed. Please try again."));
		}
	};

	const initials =
		user?.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() || "??";

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
					<Avatar size="sm">
						{user?.avatar_url && (
							<AvatarImage src={user.avatar_url} alt={user.name} />
						)}
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="flex w-full items-center justify-between text-sm">
						<span className="line-clamp-1 max-w-37.5 truncate font-semibold">
							{user?.name}
						</span>
						<ChevronsUpDown className="size-4" />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" side="top">
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<div className="flex w-full flex-col items-start text-sm">
								<span className="line-clamp-1 max-w-42.5 truncate font-semibold">
									{user?.name}
								</span>
								<span className="line-clamp-1 max-w-42.5 truncate text-muted-foreground">
									{user?.email}
								</span>
							</div>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem className="cursor-pointer">
							<SquareUserRound />
							My Profile
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={handleLogout}
							disabled={logoutMutation.isPending}
						>
							{logoutMutation.isPending ? (
								<Loader2 className="animate-spin" />
							) : (
								<LogOut />
							)}
							Log out
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
};
