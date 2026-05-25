import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	GripVertical,
	Plus,
} from "lucide-react";
import { useState } from "react";
import { Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import {
	Popover,
	PopoverContent,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { TTeam } from "@/features/teams";
import {
	CreateTeamDialog,
	myTeamsQueryOptions,
	teamQueryOptions,
} from "@/features/teams";

const chartConfig = {
	tasks: {
		label: "Tasks",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export const TeamSwitcher = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	// Extract teamId via regex directly from pathname for maximum hydration reliability
	const match = pathname.match(/^\/dashboard\/([^/]+)/);
	const teamId = match ? match[1] : undefined;
	const activeTeamId = teamId && teamId !== "personal" ? teamId : undefined;

	const { data: teamDetail, isLoading: isLoadingDetail } = useQuery(
		teamQueryOptions(activeTeamId ?? ""),
	);

	const { data: myTeams, isLoading: isLoadingTeams } = useQuery(
		myTeamsQueryOptions(),
	);
	const teams = myTeams ?? [];
	const activeTeamFromList = activeTeamId
		? teams.find((team) => team.id === activeTeamId)
		: undefined;
	const activeTeam = teamDetail ?? activeTeamFromList;
	const isLoadingActiveTeam =
		!!activeTeamId && !activeTeam && (isLoadingDetail || isLoadingTeams);

	const [page, setPage] = useState(0);
	const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
	const ITEMS_PER_PAGE = 3;
	const totalPages = Math.max(
		1,
		Math.ceil((teams?.length ?? 0) / ITEMS_PER_PAGE),
	);

	const displayTeams = teams?.slice(
		page * ITEMS_PER_PAGE,
		(page + 1) * ITEMS_PER_PAGE,
	);
	const emptySlotsCount = Math.max(
		0,
		ITEMS_PER_PAGE - (displayTeams?.length ?? 0),
	);

	const handlePrev = () => setPage((p) => Math.max(0, p - 1));
	const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

	const handleTeamCreated = (team: TTeam) => {
		navigate({
			to: "/dashboard/$teamId/overview",
			params: { teamId: team.id },
		});
	};

	return (
		<SidebarMenuItem>
			<Popover>
				<PopoverTrigger asChild>
					<SidebarMenuButton>
						<div className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/50">
							{isLoadingActiveTeam ? (
								<Skeleton className="size-full rounded-md" />
							) : activeTeam?.avatar_url && activeTeam.avatar_url !== "" ? (
								<img
									src={activeTeam.avatar_url}
									alt={activeTeam.name ?? "Team avatar"}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="text-xs font-medium text-muted-foreground uppercase">
									{(
										activeTeam?.name ?? (teamId === "personal" ? "PS" : "TM")
									).slice(0, 2)}
								</div>
							)}
						</div>
						{isLoadingActiveTeam ? (
							<Skeleton className="h-6 w-24" />
						) : (
							<span className="line-clamp-1 pr-1 text-sm font-medium">
								{activeTeam?.name ||
									(teamId === "personal" ? "Personal" : "Select Team")}
							</span>
						)}
						<SidebarMenuBadge>
							<ChevronsUpDown />
						</SidebarMenuBadge>
					</SidebarMenuButton>
				</PopoverTrigger>

				<PopoverContent align="start" side="bottom" className="w-105 gap-0 p-0">
					<div className="flex w-full items-center justify-between p-2">
						<PopoverTitle>My Teams</PopoverTitle>
						<p className="text-xs font-medium text-muted-foreground">
							Statistics in this week
						</p>
					</div>

					<div className="p-2">
						<div className="grid grid-cols-2 overflow-hidden rounded-sm border-r border-b border-dashed border-border">
							{displayTeams?.map((team, idx) => (
								<TeamTile
									key={team.id}
									team={team}
									index={page * ITEMS_PER_PAGE + idx}
								/>
							))}
							{["empty-slot-1", "empty-slot-2", "empty-slot-3"]
								.slice(0, emptySlotsCount)
								.map((key) => (
									<EmptyTile key={key} />
								))}
							<CreateTeamTile onClick={() => setIsCreateTeamDialogOpen(true)} />
						</div>
					</div>

					<CreateTeamDialog
						open={isCreateTeamDialogOpen}
						onOpenChange={setIsCreateTeamDialogOpen}
						onCreated={handleTeamCreated}
					/>

					{totalPages > 1 && (
						<div className="flex w-full items-center justify-between p-2">
							<p className="text-xs font-medium text-muted-foreground">
								{Math.min((page + 1) * ITEMS_PER_PAGE, teams?.length ?? 0)} of{" "}
								{teams?.length ?? 0} teams
							</p>
							<div className="flex items-center gap-1">
								<Button
									onClick={handlePrev}
									disabled={page === 0}
									variant="outline"
									size="icon-xs"
								>
									<ChevronLeft className="size-4" />
								</Button>
								<Button
									onClick={handleNext}
									disabled={page === totalPages - 1}
									size="icon-xs"
									variant="outline"
								>
									<ChevronRight className="size-4" />
								</Button>
							</div>
						</div>
					)}
				</PopoverContent>
			</Popover>
		</SidebarMenuItem>
	);
};

const TeamTile = ({ team, index }: { team: TTeam; index: number }) => {
	const totalTasks = team.stats?.total_tasks ?? 0;
	const completedTasks = team.stats?.completed_tasks ?? 0;
	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const activityData =
		team.stats?.weekly_activity?.map((count) => ({ tasks: count })) ??
		Array.from({ length: 7 }, () => ({ tasks: 0 }));

	return (
		<div className="group relative border-t border-l border-dashed border-border transition-colors hover:bg-accent/50">
			<Link
				to="/dashboard/$teamId/overview"
				params={{ teamId: team.id }}
				className="flex h-auto w-full flex-col items-start justify-start rounded-none p-2.5 text-left font-normal"
			>
				<div className="mb-2 flex w-full items-center gap-2">
					<div className="relative flex size-6 items-center justify-center overflow-hidden rounded-sm border bg-muted/50">
						{team.avatar_url && team.avatar_url !== "" ? (
							<img
								src={team.avatar_url}
								alt={team.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="text-xs font-medium text-muted-foreground uppercase">
								{team.name.slice(0, 2)}
							</div>
						)}
					</div>
					<div className="flex-1 truncate text-xs font-semibold">
						{team.name}
					</div>
					<div className="ml-auto flex items-center gap-1">
						<kbd className="flex size-3.5 items-center justify-center rounded border border-border bg-muted text-xs text-muted-foreground group-hover:hidden">
							{index + 1}
						</kbd>
						<GripVertical className="hidden size-3 cursor-grab text-muted-foreground group-hover:block" />
					</div>
				</div>

				<div className="mb-1.5 h-6 w-full">
					<ChartContainer
						config={chartConfig}
						className="aspect-auto! h-full w-full"
					>
						<AreaChart data={activityData}>
							<defs>
								<linearGradient
									id={`gradient-${team.id}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="var(--color-tasks)"
										stopOpacity={0.3}
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
								fill={`url(#gradient-${team.id})`}
								isAnimationActive={false}
							/>
						</AreaChart>
					</ChartContainer>
				</div>

				<div className="flex w-full items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<span className="font-semibold text-foreground">{totalTasks}</span>
						<span>tasks</span>
					</div>
					<div className="flex items-center gap-1 font-medium text-primary">
						<CheckCircle2 className="size-2.5" />
						{completionRate}%
					</div>
				</div>
			</Link>
		</div>
	);
};

const EmptyTile = () => (
	<div className="flex h-full min-h-22.5 w-full items-center justify-center border-t border-l border-dashed border-border">
		<div className="rotate-45 text-muted-foreground/10">
			<Plus className="size-3.5" />
		</div>
	</div>
);

const CreateTeamTile = ({ onClick }: { onClick?: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="group relative flex h-full min-h-22.5 flex-col items-center justify-center gap-1.5 rounded-none border-t border-l border-dashed border-border p-2 transition-colors hover:bg-accent/50"
	>
		<div className="flex size-5 items-center justify-center rounded-sm border border-border bg-background transition-colors group-hover:border-primary group-hover:bg-primary">
			<Plus className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
		</div>
		<span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
			New team
		</span>
	</button>
);
