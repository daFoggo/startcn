import { createFileRoute, Link } from "@tanstack/react-router";
import { MOCK_USERS } from "./route";

export const Route = createFileRoute("/(app)/dashboard/users/")({
	staticData: {
		hideBreadcrumb: true,
	},
	component: UsersIndexPage,
});

function UsersIndexPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold">Users Management</h1>
				<p className="text-muted-foreground">
					Click on a user to see dynamic breadcrumb in action
				</p>
			</div>

			<div className="grid gap-2">
				{Object.entries(MOCK_USERS).map(([id, user]) => (
					<Link
						key={id}
						to="/dashboard/users/$userId"
						params={{ userId: id }}
						className="block rounded-lg border p-2 transition-colors hover:bg-accent"
					>
						<div className="font-medium">{user.name}</div>
						<div className="text-sm text-muted-foreground">{user.email}</div>
					</Link>
				))}
			</div>
		</div>
	);
}
