import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TUser } from "@/features/users";
import type { TMyTasksOverview } from "../../schemas";
import { TaskList } from "./task-list";

export const TaskLineSkeleton = () => {
	return (
		<Card className="flex h-[400px] flex-col overflow-hidden p-4 space-y-4">
			<div className="flex items-center gap-2">
				<Skeleton className="size-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-8 w-24 rounded" />
				<Skeleton className="h-8 w-24 rounded" />
				<Skeleton className="h-8 w-24 rounded" />
			</div>
			<div className="space-y-2 pt-4">
				<Skeleton className="h-12 w-full rounded-lg" />
				<Skeleton className="h-12 w-full rounded-lg" />
				<Skeleton className="h-12 w-full rounded-lg" />
			</div>
		</Card>
	);
};

/**
 * TaskLine component - Orchestrates the personal tasks widget on Dashboard Overview
 */
interface ITaskLineProps {
	user: TUser;
	overview: TMyTasksOverview;
}

export const TaskLine = memo(({ user, overview }: ITaskLineProps) => {
	const { in_progress: inProgress, upcoming, overdue } = overview;

	const initials =
		user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() || "??";

	return (
		<Card className="flex h-full flex-col overflow-hidden">
			<Tabs defaultValue="progress" className="flex flex-1 flex-col">
				<CardHeader className="flex flex-col">
					<div className="flex items-center gap-2">
						<Avatar>
							{user.avatar_url && <AvatarImage src={user.avatar_url} />}
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<CardTitle className="text-xl font-semibold">My Tasks</CardTitle>
						</div>
					</div>
					<TabsList variant="line" className="h-auto">
						<TabsTrigger value="progress">In Progress</TabsTrigger>
						<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
						<TabsTrigger value="overdue" className="items-center text-center">
							Overdue
							<span className="ml-1.5 text-xs text-muted-foreground">
								{overdue.length}
							</span>
						</TabsTrigger>
					</TabsList>
				</CardHeader>
				<CardContent className="mt-2 flex min-h-0 flex-1 flex-col px-2">
					<TabsContent value="progress" className="min-h-0 flex-1">
						<TaskList tasks={inProgress} />
					</TabsContent>
					<TabsContent value="upcoming" className="min-h-0 flex-1">
						<TaskList tasks={upcoming} />
					</TabsContent>
					<TabsContent value="overdue" className="min-h-0 flex-1">
						<TaskList tasks={overdue} />
					</TabsContent>
				</CardContent>
			</Tabs>
		</Card>
	);
});

TaskLine.displayName = "TaskLine";
