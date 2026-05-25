import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { useDeferredValue, useState } from "react";
import { NestedErrorFallback } from "@/components/common/error-pages";
import { ViewModeList } from "@/components/layout/app/view-mode-list";
import { PROJECT_VIEW_MODE_CATALOG } from "@/constants/view-mode-list";
import {
	InviteProjectMemberDialog,
	projectMembersQueryOptions,
} from "@/features/project-members";
import { ProjectDetailsHeader, projectQueryOptions } from "@/features/projects";
import { taskConfigQueries } from "@/features/task-config";
import { tasksQueryOptions } from "@/features/tasks";
import { searchUsersQueryOptions, userMeQueryOptions } from "@/features/users";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/$teamId/projects/$projectId")({
	errorComponent: NestedErrorFallback,
	loader: async ({ context, params }) => {
		const { projectId } = params;
		const commonParams = { page: 1, page_size: "all" } as const;

		const project = await context.queryClient.ensureQueryData(
			projectQueryOptions(projectId),
		);

		void context.queryClient.prefetchQuery(
			tasksQueryOptions(projectId, {
				ordering: "-id",
				page: 1,
				page_size: "all",
				is_deleted__eq: false,
			}),
		);
		void context.queryClient.prefetchQuery(
			taskConfigQueries.statuses(projectId, commonParams),
		);
		void context.queryClient.prefetchQuery(
			taskConfigQueries.types(projectId, commonParams),
		);
		void context.queryClient.prefetchQuery(
			taskConfigQueries.priorities(projectId, commonParams),
		);

		return project;
	},
	component: RouteComponent,
	staticData: {
		header: {
			render: () => <ProjectHeaderWrapper />,
		},
	},
});

const ProjectHeaderWrapper = () => {
	const { teamId } = Route.useParams();
	const project = Route.useLoaderData();
	const [inviteOpen, setInviteOpen] = useState(false);
	const [inviteSearchQuery, setInviteSearchQuery] = useState("");
	const deferredInviteSearchQuery = useDeferredValue(inviteSearchQuery);
	const {
		data: membersData,
		isLoading: isMembersLoading,
		isError: isMembersError,
		error: membersError,
	} = useQuery({
		...projectMembersQueryOptions(project?.id ?? ""),
		enabled: !!project?.id,
	});
	const { data: currentUser } = useQuery(userMeQueryOptions());
	const inviteSearch = useQuery(
		searchUsersQueryOptions(deferredInviteSearchQuery, {
			excludeProjectId: project.id,
		}),
	);

	return (
		<>
			<ProjectDetailsHeader
				teamId={teamId}
				project={project}
				members={membersData?.founds ?? []}
				currentUser={currentUser}
				isMembersLoading={isMembersLoading}
				isMembersError={isMembersError}
				membersError={membersError}
				onInviteMembers={() => setInviteOpen(true)}
			/>
			<InviteProjectMemberDialog
				open={inviteOpen}
				onOpenChange={setInviteOpen}
				projectId={project.id}
				users={inviteSearch.data ?? []}
				isUsersLoading={inviteSearch.isLoading}
				isUsersError={inviteSearch.isError}
				usersError={inviteSearch.error}
				onSearchQueryChange={setInviteSearchQuery}
			/>
		</>
	);
};
function RouteComponent() {
	const { teamId, projectId } = Route.useParams();
	const matches = useMatches();
	const hideViewModeList = matches.some((m) => m.staticData.hideViewModes);
	const isFixedHeight = matches.some((m) => m.staticData.fixedHeight);

	return (
		<div
			className={cn(
				"flex min-w-0 flex-col gap-4",
				isFixedHeight && "min-h-0 flex-1 overflow-hidden",
			)}
		>
			<div className="shrink-0">
				<ViewModeList
					catalog={PROJECT_VIEW_MODE_CATALOG}
					scope="project"
					params={{ teamId, projectId }}
					hide={hideViewModeList}
				/>
			</div>
			<div
				className={cn(
					"flex min-h-0 min-w-0 flex-1 flex-col",
					isFixedHeight && "overflow-hidden",
				)}
			>
				<Outlet />
			</div>
		</div>
	);
}
