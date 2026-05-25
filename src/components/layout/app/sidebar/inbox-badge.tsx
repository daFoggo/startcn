import { cn } from "@/lib/utils";

interface IInboxBadgeProps {
	count: number | undefined;
	className?: string;
}

export const InboxBadge = ({ count, className }: IInboxBadgeProps) => {
	if (count === undefined || count === 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground shadow-sm",
				className,
			)}
		>
			{count}
		</div>
	);
};
