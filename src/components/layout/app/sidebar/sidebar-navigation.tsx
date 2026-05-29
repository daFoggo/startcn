import { IconChevronRight } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { INavigationGroup, INavigationItem } from "@/types/sidebar";
import { InboxBadge } from "./inbox-badge";

interface INavigationGroupSectionProps {
	group: INavigationGroup;
}

export const SidebarGroupSection = ({
	group,
}: INavigationGroupSectionProps) => {
	return (
		<SidebarGroup key={group.label || "default"}>
			{group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu className="gap-0.5">
					{group.items.map((item) => (
						<NavigationItem item={item} key={item.to} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};

function NavigationItem({ item }: { item: INavigationItem }) {
	const location = useLocation();
	const hasChildren = Boolean(item.children?.length);
	const isChildRouteActive =
		item.children?.some((child) => location.pathname === child.to) ?? false;
	const [isOpen, setIsOpen] = useState(isChildRouteActive);

	useEffect(() => {
		if (isChildRouteActive) {
			setIsOpen(true);
		}
	}, [isChildRouteActive]);

	return (
		<Collapsible onOpenChange={setIsOpen} open={isOpen}>
			<SidebarMenuItem>
				<Link
					activeOptions={item.exactActive ? { exact: true } : undefined}
					className="block w-full"
					to={item.to as any}
				>
					{({ isActive }) => {
						const isItemActive = isActive || isChildRouteActive;
						return (
							<SidebarMenuButton
								className={cn(hasChildren && "pr-8")}
								isActive={isItemActive}
								tooltip={item.title}
							>
								{item.icon && (
									<item.icon
										className={cn(
											"transition-colors",
											isItemActive ? "text-primary" : "text-muted-foreground",
										)}
									/>
								)}
								<span
									className={cn(
										"transition-colors",
										isItemActive ? "text-foreground" : "text-muted-foreground",
									)}
								>
									{item.title}
								</span>
								<InboxBadge badge={item.badge} />
							</SidebarMenuButton>
						);
					}}
				</Link>

				{hasChildren && (
					<CollapsibleTrigger
						render={
							<SidebarMenuAction
								aria-label={
									isOpen
										? `Collapse ${item.title} submenu`
										: `Expand ${item.title} submenu`
								}
							/>
						}
					>
						<IconChevronRight
							className={cn("transition-transform", isOpen && "rotate-90")}
						/>
					</CollapsibleTrigger>
				)}

				{hasChildren && (
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.children?.map((child) => (
								<SidebarMenuSubItem className="w-full" key={child.to}>
									<Link
										activeOptions={
											child.exactActive ? { exact: true } : undefined
										}
										className="block w-full"
										to={child.to as any}
									>
										{({ isActive }) => (
											<SidebarMenuSubButton
												className={cn(
													"w-full justify-start",
													isActive
														? "text-foreground"
														: "text-muted-foreground",
												)}
												isActive={isActive}
												render={<span />}
											>
												{child.icon && <child.icon />}
												<span>{child.title}</span>
											</SidebarMenuSubButton>
										)}
									</Link>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				)}
			</SidebarMenuItem>
		</Collapsible>
	);
}
