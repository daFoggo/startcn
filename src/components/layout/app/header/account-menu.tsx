import {
	IconAlertCircle,
	IconLoader2,
	IconSelector,
	type Icon as TablerIcon,
} from "@tabler/icons-react";
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
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface IAccountMenuUser {
	name: string;
	email?: string | null;
	avatarUrl?: string | null;
}

export interface IAccountMenuAction {
	label: string;
	icon?: TablerIcon;
	onSelect?: () => void | Promise<void>;
	disabled?: boolean;
	isLoading?: boolean;
	variant?: "default" | "destructive";
}

export interface IAccountMenuProps {
	user?: IAccountMenuUser;
	isLoading?: boolean;
	isError?: boolean;
	errorMessage?: string;
	actions?: IAccountMenuAction[];
	triggerVariant?: "header" | "sidebar";
	contentSide?: "top" | "right" | "bottom" | "left";
	contentAlign?: "start" | "center" | "end";
}

const getUserInitials = (user?: IAccountMenuUser) => {
	if (!user?.name) return "??";

	return user.name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
};

const AccountAvatar = ({ user }: { user?: IAccountMenuUser }) => (
	<Avatar size="sm">
		{user?.avatarUrl ? (
			<AvatarImage src={user.avatarUrl} alt={user.name} />
		) : null}
		<AvatarFallback className="text-xs font-semibold">
			{getUserInitials(user)}
		</AvatarFallback>
	</Avatar>
);

const AccountLoading = ({
	variant,
}: {
	variant: NonNullable<IAccountMenuProps["triggerVariant"]>;
}) => {
	if (variant === "sidebar") {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" disabled>
					<Skeleton className="size-6 rounded-full" />
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	return <Skeleton className="size-8 rounded-full" />;
};

const AccountError = ({
	message,
	variant,
}: {
	message: string;
	variant: NonNullable<IAccountMenuProps["triggerVariant"]>;
}) => {
	if (variant === "sidebar") {
		return (
			<SidebarMenuItem>
				<div className="flex items-center gap-1.5 px-2 py-1 text-xs text-destructive">
					<IconAlertCircle className="size-3.5 shrink-0" />
					<span className="truncate">{message}</span>
				</div>
			</SidebarMenuItem>
		);
	}

	return (
		<div className="flex items-center gap-1.5 text-xs text-destructive">
			<IconAlertCircle className="size-3.5 shrink-0" />
			<span className="hidden max-w-40 truncate sm:inline">{message}</span>
		</div>
	);
};

export const AccountMenu = ({
	user,
	isLoading = false,
	isError = false,
	errorMessage = "Could not load account.",
	actions = [],
	triggerVariant = "header",
	contentSide = triggerVariant === "sidebar" ? "top" : "bottom",
	contentAlign = "end",
}: IAccountMenuProps) => {
	if (isLoading) {
		return <AccountLoading variant={triggerVariant} />;
	}

	if (isError) {
		return <AccountError message={errorMessage} variant={triggerVariant} />;
	}

	const hasUserDetails = Boolean(user?.name || user?.email);
	const trigger =
		triggerVariant === "sidebar" ? (
			<SidebarMenuButton size="lg" />
		) : (
			<Button
				aria-label="Open account menu"
				variant="ghost"
				size="icon"
				className="size-8 shrink-0 rounded-full"
			/>
		);

	const triggerContent =
		triggerVariant === "sidebar" ? (
			<>
				<AccountAvatar user={user} />
				<div className="flex min-w-0 flex-1 items-center justify-between text-sm">
					<span className="line-clamp-1 max-w-36 truncate font-semibold">
						{user?.name ?? "Account"}
					</span>
					<IconSelector className="size-4 shrink-0" />
				</div>
			</>
		) : (
			<AccountAvatar user={user} />
		);

	const menu = (
		<DropdownMenu>
			<DropdownMenuTrigger render={trigger}>
				{triggerContent}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={contentAlign}
				className="w-56"
				side={contentSide}
				sideOffset={5}
			>
				{hasUserDetails ? (
					<>
						<DropdownMenuGroup>
							<DropdownMenuItem className="flex cursor-default flex-col items-start gap-0.5 px-3 py-2 focus:bg-transparent">
								<span className="line-clamp-1 max-w-48 truncate text-sm font-semibold text-foreground">
									{user?.name}
								</span>
								{user?.email ? (
									<span className="line-clamp-1 max-w-48 truncate text-xs font-normal text-muted-foreground">
										{user.email}
									</span>
								) : null}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						{actions.length > 0 ? <DropdownMenuSeparator /> : null}
					</>
				) : null}
				{actions.length > 0 ? (
					<DropdownMenuGroup>
						{actions.map((action) => {
							const Icon = action.icon;

							return (
								<DropdownMenuItem
									key={action.label}
									className="cursor-pointer"
									disabled={action.disabled || action.isLoading}
									onClick={action.onSelect}
									variant={action.variant}
								>
									{action.isLoading ? (
										<IconLoader2 className="animate-spin" />
									) : Icon ? (
										<Icon />
									) : null}
									<span>{action.label}</span>
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuGroup>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	if (triggerVariant === "sidebar") {
		return <SidebarMenuItem>{menu}</SidebarMenuItem>;
	}

	return menu;
};
