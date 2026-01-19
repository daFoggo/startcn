import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { MOCK_USERS } from "./route";

export const Route = createFileRoute("/(app)/dashboard/users/$userId")({
	staticData: {
		getTitle: () => "User Details",
	},
	beforeLoad: async ({ params }) => {
		const user = MOCK_USERS[params.userId];
		if (!user) {
			throw new Error("User not found");
		}
		return {
			breadcrumbTitle: user.name,
		};
	},
	loader: async ({ params }) => {
		const user = MOCK_USERS[params.userId];
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	},
	component: UserDetailPage,
});

function UserDetailPage() {
	const user = useLoaderData({ from: "/(app)/dashboard/users/$userId" });

	return (
		<>
			<div className="rounded-lg border p-2 sm:p-4">
				<h1 className="text-xl font-bold">{user.name}</h1>
				<div className="mt-2 space-y-2 text-muted-foreground">
					<p>
						<span className="font-medium text-foreground">Email:</span>{" "}
						{user.email}
					</p>
					<p>
						<span className="font-medium text-foreground">Role:</span>{" "}
						{user.role}
					</p>
					<p>
						<span className="font-medium text-foreground">ID:</span> {user.id}
					</p>
				</div>
			</div>

			<div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4">
				<p className="text-sm text-primary">
					👆 Notice the breadcrumb above shows the user's name (dynamic) instead
					of "User Details" (static fallback). This is powered by{" "}
					<code className="rounded bg-primary/20 px-1">beforeLoad</code>{" "}
					returning{" "}
					<code className="rounded bg-primary/20 px-1">breadcrumbTitle</code>.
				</p>
			</div>
		</>
	);
}
