import { IconChevronRight } from "@tabler/icons-react";
import { Link, useMatches } from "@tanstack/react-router";

const DASHBOARD_DYNAMIC_CONTEXT_PATH = /^\/dashboard\/([^/]+)$/;

const formatFallbackTitle = (value: string) => {
	return value
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (character) => character.toUpperCase());
};

export const AppBreadcrumbs = () => {
	const matches = useMatches();

	// Filter matches that have visible layout titles or specific static data
	const breadcrumbMatches = matches.filter((match) => {
		const staticData = match.staticData;
		if (!staticData) return false;
		return (
			staticData.getTitle ||
			staticData.header?.title ||
			match.pathname === "/dashboard" ||
			DASHBOARD_DYNAMIC_CONTEXT_PATH.test(match.pathname)
		);
	});

	if (breadcrumbMatches.length <= 1) return null;

	return (
		<nav aria-label="Breadcrumb" className="flex items-center">
			<ol className="flex items-center gap-1.5 text-xs md:text-sm font-medium select-none">
				{breadcrumbMatches.map((match, index) => {
					const isLast = index === breadcrumbMatches.length - 1;
					const staticData = match.staticData;

					// Resolve title
					let title = "";
					if (match.pathname === "/dashboard") {
						title = "Home";
					} else if (DASHBOARD_DYNAMIC_CONTEXT_PATH.test(match.pathname)) {
						const contextValue = Object.values(match.params as Record<string, string>)[0];
						title = contextValue ? formatFallbackTitle(contextValue) : "Project";
					} else if (staticData?.header?.title) {
						title =
							typeof staticData.header.title === "function"
								? staticData.header.title()
								: staticData.header.title;
					} else if (staticData?.getTitle) {
						title = staticData.getTitle();
					}

					// Skip empty titles
					if (!title) return null;

					return (
						<li key={match.id} className="flex items-center gap-1.5">
							{index > 0 && (
								<IconChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
							)}
							{isLast ? (
								<span className="text-foreground font-semibold line-clamp-1 max-w-37.5 md:max-w-60 truncate">
									{title}
								</span>
							) : (
								<Link
									to={match.pathname as any}
									className="text-muted-foreground hover:text-foreground transition-colors line-clamp-1 max-w-30 md:max-w-45 truncate"
								>
									{title}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};
