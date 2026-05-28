import { cn } from "@/lib/utils";

interface IInboxBadgeProps {
	badge: number | string | undefined;
	className?: string;
}

export const InboxBadge = ({ badge, className }: IInboxBadgeProps) => {
	if (badge === undefined || badge === 0 || badge === "") {
		return null;
	}

	return (
		<div
			className={cn(
				"ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground shadow-sm",
				className,
			)}
		>
			{badge}
		</div>
	);
};
