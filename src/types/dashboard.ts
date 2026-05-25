export interface IDashboardStore {
	last_team_id: string | null;
	setLastTeamId: (teamId: string) => void;
	reset: () => void;
	hasHydrated: boolean;
	setHasHydrated: (value: boolean) => void;
}
