import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { SITE_CONFIG } from "@/configs/site";
import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToasterProvider } from "@/providers/toaster-provider";
import appCss from "../styles.css?url";

// Inline script to prevent flash of unstyled content (FOUC)
// This runs BEFORE React hydrates, so theme is applied immediately
const themeInitScript = `
(function() {
  const storageKey = 'vite-ui-theme';
  const theme = localStorage.getItem(storageKey);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.add('light');
  }
})();
`;

export interface RootRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
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
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Blocking script to apply theme before paint */}
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for blocking theme script to prevent FOUC */}
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
				<HeadContent />
			</head>
			<body>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<TanstackQueryProvider>
						{children}
						<ToasterProvider />
					</TanstackQueryProvider>
				</ThemeProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
