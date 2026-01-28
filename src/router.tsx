import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorComponent } from "./components/common/error-component";
import { NotFoundComponent } from "./components/common/not-found-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		defaultErrorComponent: ErrorComponent,
		defaultNotFoundComponent: NotFoundComponent,
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
