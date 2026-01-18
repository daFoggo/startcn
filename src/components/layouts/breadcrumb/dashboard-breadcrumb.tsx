import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Type for dynamic context data from beforeLoad
interface BreadcrumbContext {
	breadcrumbTitle?: string;
}

/**
 * DashboardBreadcrumb - Reusable breadcrumb for TanStack Router/Start
 *
 * Supports:
 * - Static titles via staticData.getTitle
 * - Dynamic titles via context.breadcrumbTitle from beforeLoad (SSR-safe)
 * - Hidden routes via staticData.hideBreadcrumb
 */
export const DashboardBreadcrumb = () => {
	const matches = useRouterState({ select: (s) => s.matches });

	const breadcrumbs = matches
		.filter((match) => {
			// Skip root route
			if (match.id === "__root__") return false;
			// Skip hidden routes
			if (match.staticData?.hideBreadcrumb) return false;
			// Include if has static title OR dynamic title from context
			const ctx = match.context as BreadcrumbContext | undefined;
			return match.staticData?.getTitle || ctx?.breadcrumbTitle;
		})
		.map(({ pathname, context, staticData }) => {
			const ctx = context as BreadcrumbContext | undefined;
			// Priority: context.breadcrumbTitle (dynamic) > staticData.getTitle (static)
			const title = ctx?.breadcrumbTitle ?? staticData?.getTitle?.() ?? "";
			return { title, path: pathname };
		});

	if (breadcrumbs.length === 0) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => {
					const isLast = index === breadcrumbs.length - 1;
					return (
						<Fragment key={crumb.path}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{crumb.title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={crumb.path}>{crumb.title}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
