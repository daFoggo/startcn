"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/animate-ui/components/radix/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ITeam } from "@/lib/types/team.types";
import { ChevronsUpDown, Plus } from "lucide-react";

interface ISidebarTeamSwitcherProps {
  teams: ITeam[];
  activeTeam: ITeam;
  onTeamChange: (team: ITeam) => void;
}

export const SidebarTeamSwitcher = ({
  teams,
  activeTeam,
  onTeamChange,
}: ISidebarTeamSwitcherProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="flex-1 grid text-sm text-left leading-tight">
                <span className="font-semibold truncate">
                  {activeTeam.name}
                </span>
                <span className="text-xs truncate">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-lg w-(--radix-dropdown-menu-trigger-width) min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => onTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex justify-center items-center border rounded-sm size-6">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex justify-center items-center bg-background border rounded-md size-6">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
