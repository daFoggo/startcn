import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
	SIDEBAR_PERSONAL,
	SIDEBAR_PROJECT_SETTINGS,
	SIDEBAR_TEAM,
} from "@/constants/sidebar-navigation";
import { inboxStatsQueryOptions } from "@/features/inbox";
import {
	projectQueryOptions,
	projectsQueryOptions,
	SidebarProjectList,
} from "@/features/projects";
import { teamMembersQueryOptions } from "@/features/team-members";
import { getTeamPermissions } from "@/features/teams";
import { userMeQueryOptions } from "@/features/users";
import { useSidebarContextStore } from "@/stores/use-sidebar-context-store";
import { HeaderContent } from "./header-content";
import { SidebarGroupSection } from "./sidebar-navigation";
import { TeamSwitcher } from "./team-switcher";
import { ThemeToggleWrapper } from "./theme-toggle-wrapper";
import { TimezoneViewer } from "./timezone-viewer";
import { UserProfile } from "./user-profile";

/**
 * Thành phần Sidebar chính của ứng dụng Dashboard.
 * Quản lý Navigation, chuyển đổi Workspace (Team Switcher), danh sách Projects và thông tin User.
 */
export const AppSidebar = () => {
	const { pathname } = useLocation();
	const activeContextId = useSidebarContextStore(
		(state) => state.activeContextId,
	);
	const routeParams = useSidebarContextStore((state) => state.routeParams);
	const syncWithPathname = useSidebarContextStore(
		(state) => state.syncWithPathname,
	);

	const { data: inboxStats } = useQuery(inboxStatsQueryOptions());
	const unreadCount = inboxStats?.unread_count ?? 0;

	useEffect(() => {
		syncWithPathname(pathname);
	}, [pathname, syncWithPathname]);

	const isProjectSettingsContext = activeContextId === "project-settings";

	const personalNavigation = {
		...SIDEBAR_PERSONAL,
		items: SIDEBAR_PERSONAL.items.map((item) => {
			if (item.title === "Inbox") {
				return { ...item, badge: unreadCount };
			}
			return item;
		}),
	};

	const projectMatch = pathname.match(
		/^\/dashboard\/([^/]+)\/projects\/([^/]+)/,
	);
	const teamMatch = pathname.match(/^\/dashboard\/([^/]+)/);
	const teamId = teamMatch ? teamMatch[1] : "";
	const isTeamContext = Boolean(teamId && teamId !== "personal");
	const projectId = projectMatch ? projectMatch[2] : undefined;

	const { data: project } = useQuery({
		...projectQueryOptions(projectId || ""),
		enabled: !!projectId,
	});
	const timezone = project?.timezone;
	const {
		data: projectsData,
		isLoading: isProjectsLoading,
		error: projectsError,
	} = useQuery({
		...projectsQueryOptions({ team_id__eq: teamId }),
		enabled: isTeamContext,
	});
	const {
		data: currentUser,
		isLoading: isCurrentUserLoading,
		isError: isCurrentUserError,
		error: currentUserError,
	} = useQuery(userMeQueryOptions());
	const {
		data: membersData,
		isLoading: isMembersLoading,
		isError: isMembersError,
		error: membersError,
	} = useQuery({
		...teamMembersQueryOptions(teamId),
		enabled: isTeamContext,
	});
	const permissions = getTeamPermissions(
		membersData?.founds ?? [],
		currentUser?.id,
	);
	const isPermissionLoading =
		isTeamContext && (isCurrentUserLoading || isMembersLoading);
	const permissionError =
		isTeamContext && (isCurrentUserError || isMembersError)
			? (currentUserError ?? membersError)
			: undefined;
	const canCreateProject =
		permissions.canCreateProjects && !isPermissionLoading && !permissionError;

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<HeaderContent />
			</SidebarHeader>
			<SidebarContent>
				{/* Tiện ích Header */}
				<SidebarGroup>
					<SidebarMenu>
						<TeamSwitcher />
					</SidebarMenu>
				</SidebarGroup>

				{isProjectSettingsContext ? (
					<SidebarGroupSection
						group={SIDEBAR_PROJECT_SETTINGS}
						params={routeParams}
					/>
				) : (
					<>
						<SidebarGroupSection group={personalNavigation} />

						<SidebarProjectList
							teamId={teamId}
							projects={projectsData?.founds ?? []}
							isProjectsLoading={isTeamContext && isProjectsLoading}
							projectsError={projectsError}
							canCreateProject={canCreateProject}
							isPermissionLoading={isPermissionLoading}
							permissionError={permissionError}
						/>

						<SidebarGroupSection group={SIDEBAR_TEAM} />
					</>
				)}

				{/* Tiện ích Footer */}
				<SidebarGroup className="mt-auto">
					<SidebarMenu>
						<TimezoneViewer timezone={timezone} />
						<ThemeToggleWrapper />
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<Suspense
						fallback={
							<SidebarMenuItem>
								<SidebarMenuButton disabled>
									<div className="flex items-center gap-2">
										<Skeleton className="size-8 rounded-full" />
										<div className="flex flex-col gap-1">
											<Skeleton className="h-3 w-20" />
											<Skeleton className="h-2 w-24" />
										</div>
									</div>
								</SidebarMenuButton>
							</SidebarMenuItem>
						}
					>
						<UserProfile />
					</Suspense>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
