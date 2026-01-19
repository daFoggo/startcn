import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Best Practice: Set a default staleTime for data that doesn't change often
			// A staleTime of 5 minutes means data is considered fresh for 5 mins
			// and won't trigger background refetches on mount/focus during this period.
			staleTime: 1000 * 60 * 5, // 5 minutes

			// Optional: Adjust other default behaviors globally
			// Retry failed queries a specific number of times
			retry: 2, // Default is 3

			// Disable automatic refetching when the window is refocused
			// Default is true; set to false if rapid refetching is problematic
			// refetchOnWindowFocus: false,

			// Data is garbage collected after 5 minutes of being inactive by default,
			// which is generally fine.
			// gcTime: 1000 * 60 * 5, // 5 minutes (default)
		},
	},
});

export const TanstackQueryProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
