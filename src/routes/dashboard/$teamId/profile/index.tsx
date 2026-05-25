import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MyProjectsList, myProjectsQueryOptions } from "@/features/projects";
import { MyTeamsList, myTeamsQueryOptions } from "@/features/teams";
import { ProfileCard, userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute("/dashboard/$teamId/profile/")({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				myProjectsQueryOptions(params.teamId),
			),
			context.queryClient.ensureQueryData(myTeamsQueryOptions()),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]);
	},
	component: ProfileDashboardComponent,
	staticData: {
		getTitle: () => "My Profile",
	},
});

function ProfileDashboardComponent() {
	const { teamId } = Route.useParams();
	const [projectsRes, teamsRes, userRes] = useSuspenseQueries({
		queries: [
			myProjectsQueryOptions(teamId),
			myTeamsQueryOptions(),
			userMeQueryOptions(),
		],
	});

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
				<div className="flex flex-col gap-6 md:col-span-4 lg:col-span-3">
					<ProfileCard user={userRes.data} />
					<MyTeamsList teams={teamsRes.data} />
				</div>

				<div className="flex flex-col gap-6 md:col-span-8 lg:col-span-9">
					<MyProjectsList teamId={teamId} projects={projectsRes.data} />
				</div>
			</div>
		</div>
	);
}
