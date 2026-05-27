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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SITE_CONFIG } from "@/configs/site";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
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
	const { isMobile, openMobile } = useSidebar();

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
		<header className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-background px-4 select-none">
			{/* Left block: Brand + Breadcrumbs on Desktop, Brand on Mobile */}
			<div className="flex items-center gap-3">
				{/* Desktop brand & Breadcrumbs */}
				<div className="hidden items-center gap-3 md:flex">
					<Link
						to="/dashboard"
						className="flex items-center gap-2 transition-opacity hover:opacity-85"
					>
						<IconSubtitlesAi className="size-5 text-primary" />
						<span className="font-semibold leading-none tracking-tight text-foreground">
							{SITE_CONFIG.app.title}
						</span>
					</Link>
					<Separator orientation="vertical" className="h-5" />
					<AppBreadcrumbs />
				</div>

				{/* Mobile active project/org title (Left side of mobile navbar, matches Supabase) */}
				<div className="flex items-center gap-2 md:hidden">
					<Link
						to="/dashboard"
						className="flex items-center gap-2 text-sm font-semibold"
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
								className="size-8 shrink-0 rounded-full"
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
							<DropdownMenuItem className="flex cursor-default flex-col items-start gap-0.5 px-3 py-2 focus:bg-transparent">
								<span className="line-clamp-1 truncate text-sm font-semibold text-foreground">
									{user?.name}
								</span>
								<span className="line-clamp-1 truncate text-xs font-normal text-muted-foreground">
									{user?.email}
								</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								className="flex cursor-pointer items-center gap-2"
								onClick={() => navigate({ to: "/dashboard/settings" as any })}
							>
								<SquareUserRound className="text-muted-foreground" />
								<span>My Profile</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								className="flex cursor-pointer items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
								onClick={handleLogout}
								disabled={logoutMutation.isPending}
							>
								{logoutMutation.isPending ? (
									<Loader2 className="animate-spin" />
								) : (
									<LogOut />
								)}
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Mobile Hamburger Menu Trigger on the far right (Matches Supabase layout) */}
				<div className={cn("md:hidden", isMobile && openMobile && "hidden")}>
					<SidebarTrigger size="icon-sm" variant="outline" />
				</div>
			</div>
		</header>
	);
};
