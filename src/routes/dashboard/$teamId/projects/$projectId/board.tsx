import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
	getProjectPermissions,
	projectQueryOptions,
} from "@/features/projects";
import { taskConfigQueries } from "@/features/task-config";
import { mapTaskData, TaskKanban, tasksQueryOptions } from "@/features/tasks";
import { userMeQueryOptions } from "@/features/users";
import { useKanbanStore } from "@/stores/use-kanban-store";

export const Route = createFileRoute(
	"/dashboard/$teamId/projects/$projectId/board",
)({
	loader: async ({ context, params }) => {
		const { projectId } = params;
		const commonParams = { page: 1, page_size: "all" } as const;

		await Promise.all([
			context.queryClient.ensureQueryData(projectQueryOptions(projectId)),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
			context.queryClient.ensureQueryData(
				tasksQueryOptions(projectId, {
					ordering: "-id",
					page: 1,
					page_size: "all",
					is_deleted__eq: false,
				}),
			),
			context.queryClient.ensureQueryData(
				taskConfigQueries.statuses(projectId, commonParams),
			),
			context.queryClient.ensureQueryData(
				taskConfigQueries.types(projectId, commonParams),
			),
			context.queryClient.ensureQueryData(
				taskConfigQueries.priorities(projectId, commonParams),
			),
		]);
	},
	component: ProjectBoardView,
	staticData: {
		fixedHeight: true,
	},
});

function ProjectBoardView() {
	const { projectId } = Route.useParams();

	const commonParams = { page: 1, page_size: "all" } as const;

	const [
		projectRes,
		currentUserRes,
		tasksResponseRes,
		statusesResponseRes,
		typesResponseRes,
		prioritiesResponseRes,
	] = useSuspenseQueries({
		queries: [
			projectQueryOptions(projectId),
			userMeQueryOptions(),
			tasksQueryOptions(projectId, {
				ordering: "-id",
				page: 1,
				page_size: "all",
				is_deleted__eq: false,
			}),
			taskConfigQueries.statuses(projectId, commonParams),
			taskConfigQueries.types(projectId, commonParams),
			taskConfigQueries.priorities(projectId, commonParams),
		],
	});

	const project = projectRes.data;
	const currentUser = currentUserRes.data;
	const tasksResponse = tasksResponseRes.data;
	const statusesResponse = statusesResponseRes.data;
	const typesResponse = typesResponseRes.data;
	const prioritiesResponse = prioritiesResponseRes.data;

	const sortedStatuses = useMemo(() => {
		return [...statusesResponse.founds].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0),
		);
	}, [statusesResponse]);

	const sortedTypes = useMemo(() => {
		return [...typesResponse.founds].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0),
		);
	}, [typesResponse]);

	const sortedPriorities = useMemo(() => {
		return [...prioritiesResponse.founds].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0),
		);
	}, [prioritiesResponse]);

	const members = useMemo(() => project.members ?? [], [project.members]);
	const permissions = getProjectPermissions(project, currentUser?.id);

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const savedOrder = useKanbanStore((state) => state.columnOrders[projectId]);

	const finalStatuses = useMemo(() => {
		if (!mounted || !savedOrder) return sortedStatuses;
		return [...sortedStatuses].sort((a, b) => {
			const aIndex = savedOrder.indexOf(a.id);
			const bIndex = savedOrder.indexOf(b.id);
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			return aIndex - bIndex;
		});
	}, [sortedStatuses, savedOrder, mounted]);

	const taskOptions = useMemo(
		() => ({
			statuses: finalStatuses,
			types: sortedTypes,
			priorities: sortedPriorities,
		}),
		[finalStatuses, sortedTypes, sortedPriorities],
	);

	const tasks = useMemo(() => {
		return tasksResponse.founds.map((task) => mapTaskData(task, taskOptions));
	}, [tasksResponse, taskOptions]);

	if (!mounted) return null;

	return (
		<TaskKanban
			projectId={projectId}
			tasks={tasks}
			members={members}
			statuses={taskOptions.statuses}
			types={taskOptions.types}
			priorities={taskOptions.priorities}
			canManageTasks={permissions.canManageTasks}
		/>
	);
}
