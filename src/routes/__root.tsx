import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { ErrorFallback, NotFound } from "@/components/common/error-pages";
import { QueryProvider } from "@/components/common/query-provider";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ToasterProvider } from "@/components/common/toaster-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_CONFIG } from "@/configs/site";
import { getThemeServerFn, storageKey } from "@/lib/theme";
import type { IRouterContext } from "@/router";
import appCss from "../styles.css?url";

function SafeRouterDevtoolsPanel() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return <TanStackRouterDevtoolsPanel />;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: SITE_CONFIG.metadata.title,
			},
			{
				name: "description",
				content: SITE_CONFIG.metadata.description,
			},
			{
				name: "keywords",
				content: SITE_CONFIG.metadata.keywords.join(", "),
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	loader: () => getThemeServerFn(),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
	errorComponent: ErrorFallback,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const theme = Route.useLoaderData();
	const { queryClient } = Route.useRouteContext();
	const initialThemeScript = `
		(() => {
			try {
				const cookieKey = ${JSON.stringify(storageKey)};
				const cookie = document.cookie.split('; ').find((row) => row.startsWith(cookieKey + '='));
				const storedTheme = cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : 'system';
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const resolvedTheme = storedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : storedTheme;
				const root = document.documentElement;
				root.classList.remove('light', 'dark');
				root.classList.add(resolvedTheme);
			} catch (error) {
			}
		})();
	`;
	return (
		<html
			lang="en"
			className={theme === "dark" ? "dark" : "light"}
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: initialThemeScript }} />
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<QueryProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<TooltipProvider>{children}</TooltipProvider>
						<ToasterProvider />
					</ThemeProvider>
				</QueryProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <SafeRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
