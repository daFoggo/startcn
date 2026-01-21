import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundComponent() {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
			<div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
				<FileQuestion className="h-6 w-6 text-gray-600 dark:text-gray-400" />
			</div>
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tighter">Page Not Found</h1>
				<p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					The page you are looking for does not exist.
				</p>
			</div>
			<Button asChild>
				<Link to="/">Back to Home</Link>
			</Button>
		</div>
	);
}
