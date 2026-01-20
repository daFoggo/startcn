import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/layouts/dashboard";
import { ListViewContent, usersQueryOptions } from "@/features/users";

export const Route = createFileRoute("/(app)/dashboard/users/")({
	staticData: {
		hideBreadcrumb: true,
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(usersQueryOptions);
	},
	component: UsersPage,
});

function UsersPage() {
	const usersQuery = useSuspenseQuery(usersQueryOptions);
	const users = usersQuery.data;

	return (
		<>
			<PageTitle title="Users" />
			<ListViewContent users={users} />
		</>
	);
}
