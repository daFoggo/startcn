import type { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { ReactNode } from "react";
import type { IAppPageHeaderConfig } from "@/components/layout/app/page-container";
import { createQueryClient } from "@/lib/query-client";
import { routeTree } from "./routeTree.gen";

export interface IRouterContext {
	queryClient: QueryClient;
}

export function getRouter() {
	const queryClient = createQueryClient();

	const router = createTanStackRouter({
		routeTree,
		context: {
			queryClient,
		},

		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		wrapQueryClient: false,
	});

	return router;
}

export interface IRouteHeaderConfig {
	hide?: boolean;
	title?: string | (() => string);
	render?: () => ReactNode;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}

	interface StaticDataRouteOption {
		getTitle?: () => string;
		hideHeader?: boolean;
		hideSidebar?: boolean;
		header?: IRouteHeaderConfig;
		fixedHeight?: boolean;
		pageHeader?: IAppPageHeaderConfig | ReactNode;
		pageContainerSize?: "small" | "default" | "large" | "full";
	}
}
