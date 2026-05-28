import { IconSubtitlesAi, type Icon as TablerIcon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/common/theme-provider/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AccountMenu, type IAccountMenuAction } from "./account-menu";
import { AppBreadcrumbs, type IAppBreadcrumbItem } from "./breadcrumbs";

interface IAppHeaderBrand {
	title: string;
	to: string;
	icon?: TablerIcon;
}

interface IAppHeaderUser {
	name: string;
	email?: string | null;
	avatarUrl?: string | null;
}

interface IAppHeaderProps {
	brand: IAppHeaderBrand;
	breadcrumbs: IAppBreadcrumbItem[];
	user?: IAppHeaderUser;
	isUserLoading?: boolean;
	isUserError?: boolean;
	userErrorMessage?: string;
	accountActions?: IAccountMenuAction[];
}

export const AppHeader = ({
	brand,
	breadcrumbs,
	user,
	isUserLoading = false,
	isUserError = false,
	userErrorMessage,
	accountActions = [],
}: IAppHeaderProps) => {
	const { isMobile, openMobile } = useSidebar();
	const BrandIcon = brand.icon ?? IconSubtitlesAi;

	return (
		<header className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-background px-4 select-none">
			<div className="flex items-center gap-3">
				<div className="hidden items-center gap-3 md:flex">
					<Link
						to={brand.to as any}
						className="flex items-center gap-2 transition-opacity hover:opacity-85"
					>
						<BrandIcon className="size-5 text-primary" />
						<span className="font-semibold leading-none tracking-tight text-foreground">
							{brand.title}
						</span>
					</Link>
					<Separator orientation="vertical" className="h-5" />
					<AppBreadcrumbs items={breadcrumbs} />
				</div>

				<div className="flex items-center gap-2 md:hidden">
					<Link
						to={brand.to as any}
						className="flex items-center gap-2 text-sm font-semibold"
					>
						<BrandIcon className="size-4.5 text-primary" />
						<span>{brand.title}</span>
					</Link>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />

				<AccountMenu
					user={user}
					isLoading={isUserLoading}
					isError={isUserError}
					errorMessage={userErrorMessage}
					actions={accountActions}
					triggerVariant="header"
				/>

				<div className={cn("md:hidden", isMobile && openMobile && "hidden")}>
					<SidebarTrigger size="icon-sm" variant="outline" />
				</div>
			</div>
		</header>
	);
};
