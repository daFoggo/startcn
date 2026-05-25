import { Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	ChevronRight,
	FolderClosed,
	FolderOpen,
	Plus,
	TextAlignStart,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import type { TProject } from "../schemas";
import { CreateProjectDialog } from "./create-project-dialog";

const VISIBLE_PROJECT_LIMIT = 2;

const chartConfig = {
	tasks: {
		label: "Tasks",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

interface ISidebarProjectListProps {
	teamId: string;
	projects: TProject[];
	isProjectsLoading?: boolean;
	projectsError?: unknown;
	canCreateProject?: boolean;
	isPermissionLoading?: boolean;
	permissionError?: unknown;
}

/**
 * Hiển thị danh sách các Project của Team trên thanh Sidebar.
 * Tự động đồng bộ trạng thái Active và các hiệu ứng Icon khi người dùng điều hướng.
 */
export const SidebarProjectList = ({
	teamId,
	projects,
	isProjectsLoading = false,
	projectsError,
	canCreateProject = false,
	isPermissionLoading = false,
	permissionError,
}: ISidebarProjectListProps) => {
	const navigate = useNavigate();

	const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
		useState(false);

	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isInitialLoading = isProjectsLoading || !isMounted;

	const visibleProjects = projects.slice(0, VISIBLE_PROJECT_LIMIT);
	const hasMoreProjects = projects.length > VISIBLE_PROJECT_LIMIT;

	const handleProjectCreated = (project: TProject) => {
		navigate({
			to: "/dashboard/$teamId/projects/$projectId/dashboard",
			params: { teamId, projectId: project.id },
		});
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarMenu className="gap-0.5" suppressHydrationWarning>
				{isInitialLoading &&
					["project-skeleton-1", "project-skeleton-2"].map((key) => (
						<SidebarMenuItem key={key}>
							<SidebarMenuButton disabled>
								<Skeleton className="size-4 shrink-0" />
								<Skeleton className="h-3.5 flex-1" />
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}

				{!isInitialLoading && !!projectsError && (
					<div className="flex items-center gap-1.5 px-2 py-1 text-xs text-destructive">
						<AlertCircle className="size-3.5 shrink-0" />
						<span className="truncate">Failed to load projects</span>
					</div>
				)}

				{!isInitialLoading && !projectsError && projects.length === 0 && (
					<div className="px-2 py-1 text-xs text-muted-foreground">
						You have no projects yet.
					</div>
				)}

				{!isInitialLoading &&
					visibleProjects.map((project) => (
						<SidebarMenuItem key={project.id}>
							<Link
								to="/dashboard/$teamId/projects/$projectId"
								params={{ teamId: teamId || "personal", projectId: project.id }}
							>
								{({ isActive }) => {
									const Icon = isActive ? FolderOpen : FolderClosed;
									return (
										<SidebarMenuButton
											isActive={isActive}
											tooltip={project.name}
										>
											<Icon
												className={cn(
													"size-4 transition-colors",
													isActive ? "text-primary" : "text-muted-foreground",
												)}
											/>
											<span
												className={cn(
													"truncate transition-colors",
													isActive
														? "text-foreground"
														: "text-muted-foreground",
												)}
											>
												{project.name}
											</span>
										</SidebarMenuButton>
									);
								}}
							</Link>
						</SidebarMenuItem>
					))}

				{!isInitialLoading &&
					(hasMoreProjects ||
						isPermissionLoading ||
						permissionError ||
						canCreateProject) && (
						<SidebarMenuItem>
							{hasMoreProjects ? (
								<MoreProjectsPopover
									projects={projects}
									teamId={teamId}
									canCreateProject={canCreateProject}
									isPermissionLoading={isPermissionLoading}
									permissionError={permissionError}
									onCreateProject={() => setIsCreateProjectDialogOpen(true)}
								/>
							) : isPermissionLoading ? (
								<SidebarMenuButton disabled>
									<Skeleton className="size-4 shrink-0" />
									<Skeleton className="h-3.5 flex-1" />
								</SidebarMenuButton>
							) : permissionError ? (
								<div className="flex items-center gap-1.5 px-2 py-1 text-xs text-destructive">
									<AlertCircle className="size-3.5 shrink-0" />
									<span className="truncate">
										{getErrorMessage(
											permissionError,
											"Could not load project permissions.",
										)}
									</span>
								</div>
							) : canCreateProject ? (
								<SidebarMenuButton
									onClick={() => setIsCreateProjectDialogOpen(true)}
									tooltip="Create new project"
								>
									<Plus className="size-4" />
									<span>Create new project</span>
								</SidebarMenuButton>
							) : null}
						</SidebarMenuItem>
					)}
			</SidebarMenu>

			<CreateProjectDialog
				open={isCreateProjectDialogOpen}
				teamId={teamId}
				onOpenChange={setIsCreateProjectDialogOpen}
				onCreated={handleProjectCreated}
			/>
		</SidebarGroup>
	);
};

const MoreProjectsPopover = ({
	projects,
	teamId,
	canCreateProject,
	isPermissionLoading,
	permissionError,
	onCreateProject,
}: {
	projects: Array<TProject>;
	teamId: string;
	canCreateProject: boolean;
	isPermissionLoading: boolean;
	permissionError: unknown;
	onCreateProject: () => void;
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<SidebarMenuButton tooltip="More projects">
					<TextAlignStart className="size-4" />
					<span>More projects</span>
					<SidebarMenuBadge>
						<ChevronRight className="size-3.5" />
					</SidebarMenuBadge>
				</SidebarMenuButton>
			</PopoverTrigger>

			<PopoverContent
				side="right"
				align="start"
				sideOffset={8}
				className="w-84 gap-2 p-2"
			>
				<PopoverHeader className="px-1">
					<PopoverTitle>My projects</PopoverTitle>
				</PopoverHeader>

				<div className="max-h-76 space-y-1 overflow-y-auto pr-1">
					{projects.map((project) => (
						<ProjectListItem
							key={project.id}
							teamId={teamId}
							project={project}
						/>
					))}
				</div>

				{isPermissionLoading ? (
					<div className="mt-1 flex items-center gap-2 px-2 py-1.5">
						<Skeleton className="size-4 shrink-0" />
						<Skeleton className="h-3.5 flex-1" />
					</div>
				) : permissionError ? (
					<div className="mt-1 flex items-center gap-1.5 px-2 py-1 text-xs text-destructive">
						<AlertCircle className="size-3.5 shrink-0" />
						<span className="truncate">
							{getErrorMessage(
								permissionError,
								"Could not load project permissions.",
							)}
						</span>
					</div>
				) : canCreateProject ? (
					<Button onClick={onCreateProject} className="mt-1 w-full" size="sm">
						<Plus className="size-4" />
						<span>Create new project</span>
					</Button>
				) : null}
			</PopoverContent>
		</Popover>
	);
};

const ProjectListItem = ({
	project,
	teamId,
}: {
	project: TProject;
	teamId: string;
}) => {
	const totalTasks = project.stats?.total_tasks ?? 0;
	const completedTasks = project.stats?.completed_tasks ?? 0;
	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const activityData = useMemo(
		() =>
			project.stats?.weekly_activity?.map((count) => ({ tasks: count })) ??
			Array.from({ length: 7 }, () => ({ tasks: 0 })),
		[project.stats?.weekly_activity],
	);

	return (
		<Link
			to="/dashboard/$teamId/projects/$projectId"
			params={{ teamId, projectId: project.id }}
			className="block rounded-md border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-accent"
		>
			<div className="mb-1 flex items-center justify-between gap-2">
				<span className="truncate text-xs font-semibold">{project.name}</span>
				<div className="flex items-center gap-1 text-xs font-medium text-primary">
					<CheckCircle2 className="size-2.5" />
					{completionRate}%
				</div>
			</div>

			<div className="h-5 w-full">
				<ChartContainer config={chartConfig} className="h-full w-full">
					<AreaChart data={activityData}>
						<defs>
							<linearGradient
								id={`project-gradient-${project.id}`}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="var(--color-tasks)"
									stopOpacity={0.25}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-tasks)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<Area
							type="monotone"
							dataKey="tasks"
							stroke="var(--color-tasks)"
							strokeWidth={1}
							fillOpacity={1}
							fill={`url(#project-gradient-${project.id})`}
							isAnimationActive={false}
						/>
					</AreaChart>
				</ChartContainer>
			</div>
		</Link>
	);
};
