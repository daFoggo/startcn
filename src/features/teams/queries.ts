import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createTeamFn,
	deleteTeamFn,
	fetchMyTeamsFn,
	fetchTeamByIdFn,
	fetchTeamsFn,
	updateTeamFn,
} from "./functions";

export const teamKeys = {
	all: ["teams"] as const,
	lists: () => [...teamKeys.all, "list"] as const,
	list: (params?: any) => [...teamKeys.lists(), params] as const,
	myTeams: () => [...teamKeys.all, "me"] as const,
	details: () => [...teamKeys.all, "detail"] as const,
	detail: (id: string) => [...teamKeys.details(), id] as const,
};

export const teamsQueryOptions = (params?: any) =>
	queryOptions({
		queryKey: teamKeys.list(params),
		queryFn: () => fetchTeamsFn({ data: params }),
	});

export const myTeamsQueryOptions = () =>
	queryOptions({
		queryKey: teamKeys.myTeams(),
		queryFn: () => fetchMyTeamsFn(),
	});

export const teamQueryOptions = (teamId: string) =>
	queryOptions({
		queryKey: teamKeys.detail(teamId),
		queryFn: () => fetchTeamByIdFn({ data: teamId }),
	});

export const useTeamMutations = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: (payload: any) => createTeamFn({ data: payload }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: teamKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: teamKeys.myTeams() }),
			]);
		},
	});

	const update = useMutation({
		mutationFn: (data: { teamId: string; payload: any }) =>
			updateTeamFn({ data }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: teamKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: teamKeys.myTeams() }),
				queryClient.invalidateQueries({
					queryKey: teamKeys.detail(variables.teamId),
				}),
			]);
		},
	});

	const remove = useMutation({
		mutationFn: (teamId: string) => deleteTeamFn({ data: teamId }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: teamKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: teamKeys.myTeams() }),
			]);
		},
	});

	return { create, update, remove };
};
