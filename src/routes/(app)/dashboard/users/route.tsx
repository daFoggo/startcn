import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/users")({
	staticData: {
		getTitle: () => "Users",
	},
	component: UsersLayout,
});

export const MOCK_USERS: Record<
	string,
	{ id: string; name: string; email: string; role: string }
> = {
	"1": {
		id: "1",
		name: "Nguyễn Văn A",
		email: "nguyenvana@example.com",
		role: "Admin",
	},
	"2": {
		id: "2",
		name: "Trần Thị B",
		email: "tranthib@example.com",
		role: "Editor",
	},
	"3": {
		id: "3",
		name: "Lê Hoàng C",
		email: "lehoangc@example.com",
		role: "Viewer",
	},
};

function UsersLayout() {
	return (
		<div className="p-2 sm:p-4 space-y-2 sm:space-y-4 overflow-hidden">
			<Outlet />
		</div>
	);
}
