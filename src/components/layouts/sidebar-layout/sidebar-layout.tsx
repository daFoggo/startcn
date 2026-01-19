"use client";

import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import type { SidebarLayoutProps } from "@/types/sidebar";

export const SidebarLayout = ({
	children,
	variant = "inset",
	header,
	footer,
	navigation,
}: SidebarLayoutProps) => {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon" variant={variant}>
				{header && <SidebarHeader>{header}</SidebarHeader>}

				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							{navigation.map((item) => (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={item.isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<Link to={item.to}>
												<SidebarMenuButton tooltip={item.title}>
													{item.items ? (
														<>
															{item.icon && <item.icon className="size-4" />}
															<span>{item.title}</span>
															<ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-300" />
														</>
													) : (
														<>
															{item.icon && <item.icon className="size-4" />}
															<span>{item.title}</span>
														</>
													)}
												</SidebarMenuButton>
											</Link>
										</CollapsibleTrigger>
										{item.items && (
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items.map((subItem) => (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton asChild>
																<Link to={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										)}
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>

				{footer && <SidebarFooter>{footer}</SidebarFooter>}
			</Sidebar>

			<SidebarInset className="overflow-hidden">{children}</SidebarInset>
		</SidebarProvider>
	);
};
