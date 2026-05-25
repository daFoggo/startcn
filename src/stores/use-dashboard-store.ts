import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IDashboardStore } from "@/types/dashboard";

/**
 * Lưu trữ một số thông tin thường dùng trong dashboard, ví dụ last_team_id để user nếu truy cầu từ /dashboard có thể đưa
 * vào route như /dashboard/$teamId/...
 */
export const useDashboardStore = create<IDashboardStore>()(
	persist(
		(set) => ({
			last_team_id: null,
			hasHydrated: false,

			setLastTeamId: (teamId) =>
				set(() => ({
					last_team_id: teamId,
				})),

			reset: () =>
				set(() => ({
					last_team_id: null,
				})),

			setHasHydrated: (value) =>
				set(() => ({
					hasHydrated: value,
				})),
		}),
		{
			name: "dashboard-persistence-storage",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);

export const useDashboardHydrated = () =>
	useDashboardStore((state) => state.hasHydrated);
