import { Link, useParams } from "@tanstack/react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { ISidebarGroup } from "@/types/sidebar";
import { InboxBadge } from "./inbox-badge";

interface ISidebarGroupSectionProps {
	group: ISidebarGroup;
	params?: Record<string, string>;
}

const sanitizeParams = (params: Record<string, string | undefined>) =>
	Object.fromEntries(
		Object.entries(params).filter(([, value]) => Boolean(value)),
	) as Record<string, string>;

export const SidebarGroupSection = ({
	group,
	params,
}: ISidebarGroupSectionProps) => {
	const { teamId } = useParams({ strict: false });
	const linkParams = sanitizeParams({
		teamId,
		...params,
	});

	return (
		<SidebarGroup key={group.label || "default"}>
			{group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu className="gap-0.5">
					{group.items.map((item) => (
						<SidebarMenuItem key={item.to}>
							<Link
								to={item.to as any}
								params={linkParams as any}
								activeOptions={item.exactActive ? { exact: true } : undefined}
							>
								{({ isActive }) => (
									<SidebarMenuButton tooltip={item.title} isActive={isActive}>
										{item.icon && (
											<item.icon
												className={cn(
													"transition-colors",
													isActive ? "text-primary" : "text-muted-foreground",
												)}
											/>
										)}
										<span
											className={cn(
												"transition-colors",
												isActive ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{item.title}
										</span>
										{item.title === "Inbox" &&
										item.badge !== undefined &&
										item.badge !== 0 ? (
											<InboxBadge count={item.badge as number} />
										) : null}
									</SidebarMenuButton>
								)}
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};
