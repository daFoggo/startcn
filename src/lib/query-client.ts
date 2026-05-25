import { QueryClient } from "@tanstack/react-query";

/**
 * Hàm tạo (factory) một QueryClient mới.
 * Được sử dụng trong router để khởi tạo QueryClient độc lập cho mỗi phiên / request (hỗ trợ SSR).
 */
export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
				gcTime: 1000 * 60 * 10, // Cache được giữ lại trong bộ nhớ 10 phút sau khi không sử dụng
			},
		},
	});
