import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	ChevronsUpDown,
	Loader2,
	LogOut,
	Settings,
	SquareUserRound,
} from "lucide-react";
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
import { useAuthMutations } from "@/features/auth";
import { userMeQueryOptions } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { useViewModeListStore } from "@/stores/use-view-mode-list-store";

export const UserProfile = () => {
	const navigate = useNavigate();
	const { data: user } = useSuspenseQuery(userMeQueryOptions());
	const { signOut: logoutMutation } = useAuthMutations();

	const handleLogout = async () => {
		try {
			await logoutMutation.mutateAsync();
			const { deleteAuthToken } = await import("@/lib/auth-token");
			await deleteAuthToken();

			// Clear client-side data
			useDashboardStore.getState().reset();
			useViewModeListStore.getState().resetAll();

			toast.success("Logged out successfully");
			navigate({ to: "/auth/sign-in" });
		} catch (error) {
			toast.error(getErrorMessage(error, "Logout failed. Please try again."));
		}
	};

	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() || "??";

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton size="lg">
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
					</SidebarMenuButton>
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
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() =>
								navigate({
									to: "/dashboard/$teamId/profile",
									params: {
										teamId:
											useDashboardStore.getState().last_team_id || "personal",
									},
								})
							}
						>
							<SquareUserRound />
							My Profile
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<Settings />
							Settings
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
								<Loader2 className="size-4 animate-spin" />
							) : (
								<LogOut className="size-4" />
							)}
							Log out
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
};
