"use client";

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
} from "@/components/animate-ui/components/radix/sidebar";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import type { ISidebarLayoutProps } from "@/lib/types/sidebar.types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const SidebarLayout = ({
  children,
  variant = "inset",
  header,
  footer,
  navigation,
}: ISidebarLayoutProps) => {
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
                    <AnimateIcon animateOnHover animateOnView>
                      <CollapsibleTrigger asChild>
                        <Link href={item.url || ""}>
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
                    </AnimateIcon>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
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

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
