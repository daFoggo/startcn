import { Skeleton } from "@/components/ui/skeleton";

export const ViewModeListSkeleton = () => (
	<div className="space-y-3 w-full">
		<div className="flex justify-between items-center gap-2">
			<Skeleton className="rounded-lg w-72 h-8" />
			<Skeleton className="rounded-md w-28 h-8" />
		</div>
	</div>
);
