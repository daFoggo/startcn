import * as Sentry from "@sentry/tanstackstart-react";
import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ErrorComponent({ error }: { error: Error }) {
	const router = useRouter();

	useEffect(() => {
		console.error(error);
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
			<div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
				<AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
			</div>
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tighter">
					Something went wrong
				</h1>
				<p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					{error.message || "An unexpected error occurred"}
				</p>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" onClick={() => router.history.go(-1)}>
					Go Back
				</Button>
				<Button asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</div>
		</div>
	);
}
