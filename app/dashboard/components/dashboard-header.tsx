"use client";

import { ThemeSwitcher } from "@/components/animate-ui/components/animate/theme-switcher";
import { SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";
import {
  GithubStars,
  GithubStarsIcon,
  GithubStarsLogo,
  GithubStarsNumber,
  GithubStarsParticles,
} from "@/components/animate-ui/primitives/animate/github-stars";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/configs/site";
import { StarIcon } from "lucide-react";
import type { ReactNode } from "react";

interface IDashboardHeaderProps {
  breadcrumbs?: ReactNode;
}

export const DashboardHeader = ({ breadcrumbs }: IDashboardHeaderProps) => {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="my-2" />
        {breadcrumbs && breadcrumbs}
        <div className="flex items-center gap-2 ml-auto">
          <GithubStars
            username={SITE_CONFIG.github.name}
            repo={SITE_CONFIG.github.repo}
            delay={2000}
            asChild
          >
            <a
              href={SITE_CONFIG.github.url}
              rel="noreferrer noopener"
              target="_blank"
              className="sm:mt-1 group cursor-pointer justify-center rounded-md text-sm group font-medium transition-colors duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground p-1.5 [&_svg]:size-5 text-fd-muted-foreground sm:[&_svg]:size-5.5 flex items-center gap-x-2"
            >
              <GithubStarsLogo className="size-4" />

              <span className="rounded-sm flex items-center gap-x-1 select-none bg-accent  text-sm py-1 pl-1.5 pr-[5px]">
                <GithubStarsNumber />{" "}
                <GithubStarsParticles>
                  <GithubStarsIcon
                    icon={StarIcon}
                    className="size-4!"
                    activeClassName="text-muted-foreground group-hover:text-current"
                  />
                </GithubStarsParticles>
              </span>
            </a>
          </GithubStars>
          <Separator orientation="vertical" className="my-2" />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
