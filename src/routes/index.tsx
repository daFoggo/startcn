import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="flex flex-col min-h-dvh items-center justify-center">
			<Link to="/dashboard">Go to /dashboard</Link>
		</div>
	);
}
