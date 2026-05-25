import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { projectKeys } from "@/features/projects";
import { teamMemberKeys } from "@/features/team-members";
import {
	acceptProjectInviteFn,
	addProjectMemberFn,
	generateProjectInviteFn,
	getProjectMembersFn,
	removeProjectMemberFn,
	updateProjectMemberRoleFn,
} from "./functions";
import type {
	TAddProjectMemberInput,
	TProjectInviteAcceptRequest,
	TProjectInviteGenerateRequest,
	TUpdateProjectMemberRoleInput,
} from "./schemas";

export const projectMemberKeys = {
	all: ["projectMembers"] as const,
	lists: () => [...projectMemberKeys.all, "list"] as const,
	list: (projectId: string) =>
		[...projectMemberKeys.lists(), projectId] as const,
};

export const projectMembersQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: projectMemberKeys.list(projectId),
		queryFn: () => getProjectMembersFn({ data: { projectId } }),
	});

export const useProjectMemberMutations = () => {
	const queryClient = useQueryClient();

	const addMember = useMutation({
		mutationFn: (payload: TAddProjectMemberInput) =>
			addProjectMemberFn({ data: payload }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: projectMemberKeys.list(variables.projectId),
				}),
				queryClient.invalidateQueries({
					queryKey: teamMemberKeys.all,
				}),
			]);
		},
	});

	const updateRole = useMutation({
		mutationFn: (payload: TUpdateProjectMemberRoleInput) =>
			updateProjectMemberRoleFn({ data: payload }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: projectMemberKeys.list(variables.projectId),
				}),
				queryClient.invalidateQueries({
					queryKey: teamMemberKeys.all,
				}),
			]);
		},
	});

	const removeMember = useMutation({
		mutationFn: (data: { projectId: string; user_id: string }) =>
			removeProjectMemberFn({ data }),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: projectMemberKeys.list(variables.projectId),
				}),
				queryClient.invalidateQueries({
					queryKey: teamMemberKeys.all,
				}),
				queryClient.invalidateQueries({
					queryKey: projectKeys.all,
				}),
			]);
		},
	});

	const generateInvite = useMutation({
		mutationFn: (data: {
			projectId: string;
			payload: TProjectInviteGenerateRequest;
		}) => generateProjectInviteFn({ data }),
	});

	const acceptInvite = useMutation({
		mutationFn: (data: TProjectInviteAcceptRequest) =>
			acceptProjectInviteFn({ data }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: projectMemberKeys.all,
				}),
				queryClient.invalidateQueries({
					queryKey: teamMemberKeys.all,
				}),
			]);
		},
	});

	return { addMember, updateRole, removeMember, generateInvite, acceptInvite };
};
