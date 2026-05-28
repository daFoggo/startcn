import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export interface IAppBreadcrumbItem {
	id: string;
	title: string;
	to?: string;
	isCurrent?: boolean;
}

interface IAppBreadcrumbsProps {
	items: IAppBreadcrumbItem[];
}

export const AppBreadcrumbs = ({ items }: IAppBreadcrumbsProps) => {
	if (items.length <= 1) return null;
	return (
		<nav aria-label="Breadcrumb" className="flex items-center">
			<ol className="flex items-center gap-2 text-xs font-medium select-none md:text-sm">
				{items.map((item, index) => {
					const isLast = item.isCurrent ?? index === items.length - 1;
					return (
						<li key={item.id} className="flex items-center gap-2">
							{index > 0 && (
								<IconChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
							)}
							{isLast || !item.to ? (
								<span className="text-foreground font-semibold line-clamp-1 max-w-37.5 md:max-w-60 truncate">
									{item.title}
								</span>
							) : (
								<Link
									to={item.to as any}
									className="text-muted-foreground hover:text-foreground transition-colors line-clamp-1 max-w-30 md:max-w-45 truncate"
								>
									{item.title}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};
