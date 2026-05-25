import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Wrapper component cung cấp QueryClient cho toàn bộ ứng dụng.
 * Cho phép các components bên trong sử dụng các hooks của React Query để quản lý server state.
 */
export function QueryProvider({
	children,
	client,
}: {
	children: ReactNode;
	client: QueryClient;
}) {
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
