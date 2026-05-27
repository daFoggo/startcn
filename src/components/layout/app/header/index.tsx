import {
	IconSubtitlesAi,
	IconLoader2 as Loader2,
	IconLogout as LogOut,
	IconUserSquareRounded as SquareUserRound,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/common/theme-provider/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SITE_CONFIG } from "@/configs/site";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { AppBreadcrumbs } from "./breadcrumbs";

interface IAppHeaderProps {
	user?: TUser;
	logoutMutation: {
		mutateAsync: () => Promise<void>;
		isPending: boolean;
	};
}

export const AppHeader = ({ user, logoutMutation }: IAppHeaderProps) => {
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
		<header className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b  bg-background px-4 select-none">
			{/* Left block: Brand + Breadcrumbs on Desktop, Brand on Mobile */}
			<div className="flex items-center gap-3">
				{/* Desktop brand & Breadcrumbs */}
				<div className="hidden md:flex items-center gap-3">
					<Link
						to="/dashboard"
						className="flex items-center gap-2 hover:opacity-85 transition-opacity"
					>
						<IconSubtitlesAi className="size-5 text-primary" />
						<span className=" font-semibold tracking-tight leading-none letter-spacing-[-0.015em] text-foreground">
							{SITE_CONFIG.app.title}
						</span>
					</Link>
					<Separator orientation="vertical" className="h-5" />
					<AppBreadcrumbs />
				</div>

				{/* Mobile active project/org title (Left side of mobile navbar, matches Supabase) */}
				<div className="md:hidden flex items-center gap-2">
					<Link
						to="/dashboard"
						className="flex items-center gap-1.5 font-semibold text-sm"
					>
						<IconSubtitlesAi className="size-4.5 text-primary" />
						<span>{SITE_CONFIG.app.title}</span>
					</Link>
				</div>
			</div>

			{/* Right block: Theme Switcher & User Profile & Mobile Trigger (Right side, matches Supabase) */}
			<div className="flex items-center gap-3">
				<ThemeToggle />

				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full size-8 shrink-0 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							/>
						}
					>
						<Avatar size="sm">
							{user?.avatar_url && (
								<AvatarImage src={user.avatar_url} alt={user.name} />
							)}
							<AvatarFallback className="text-xs font-semibold">
								{initials}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56" sideOffset={5}>
						<DropdownMenuGroup>
							<DropdownMenuItem className="flex flex-col items-start gap-0.5 px-3 py-2 cursor-default focus:bg-transparent">
								<span className="line-clamp-1 truncate font-semibold text-sm text-foreground">
									{user?.name}
								</span>
								<span className="line-clamp-1 truncate text-xs text-muted-foreground font-normal">
									{user?.email}
								</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								className="cursor-pointer flex items-center gap-2"
								onClick={() => navigate({ to: "/dashboard/settings" as any })}
							>
								<SquareUserRound className="size-4 text-muted-foreground" />
								<span>My Profile</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
								onClick={handleLogout}
								disabled={logoutMutation.isPending}
							>
								{logoutMutation.isPending ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<LogOut className="size-4" />
								)}
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Mobile Hamburger Menu Trigger on the far right (Matches Supabase layout) */}
				<div className="md:hidden">
					<SidebarTrigger size="icon-sm" variant="outline" />
				</div>
			</div>
		</header>
	);
};
