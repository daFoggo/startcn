import * as Sentry from "@sentry/tanstackstart-react";
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

	if (!router.isServer) {
		Sentry.init({
			dsn: "https://7ab0bbbbc07fabd12c9df3c3b22b4df6@o4507204274094080.ingest.us.sentry.io/4510747309441024",

			// Adds request headers and IP for users, for more info visit:
			// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
			sendDefaultPii: true,
		});
	}

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
