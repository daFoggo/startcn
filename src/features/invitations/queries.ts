import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { projectKeys } from "@/features/projects";
import { teamKeys } from "@/features/teams";
import {
	acceptInvitationFn,
	declineInvitationFn,
	getInvitationByIdFn,
	getMyInvitationsFn,
} from "./functions";

export const invitationKeys = {
	all: ["invitations"] as const,
	lists: () => [...invitationKeys.all, "list"] as const,
	my: () => [...invitationKeys.lists(), "my"] as const,
	details: () => [...invitationKeys.all, "detail"] as const,
	detail: (id: string) => [...invitationKeys.details(), id] as const,
};

export const myInvitationsQueryOptions = () =>
	queryOptions({
		queryKey: invitationKeys.my(),
		queryFn: () => getMyInvitationsFn(),
	});

export const invitationDetailQueryOptions = (invitationId: string) =>
	queryOptions({
		queryKey: invitationKeys.detail(invitationId),
		queryFn: () => getInvitationByIdFn({ data: { invitationId } }),
	});

export function useInvitationMutations() {
	const queryClient = useQueryClient();

	const accept = useMutation({
		mutationFn: (invitationId: string) =>
			acceptInvitationFn({ data: { invitationId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: invitationKeys.my(),
			});
			// Invalidate projects/teams so the new ones show up
			queryClient.invalidateQueries({ queryKey: teamKeys.all });
			queryClient.invalidateQueries({ queryKey: projectKeys.all });
		},
	});

	const decline = useMutation({
		mutationFn: (invitationId: string) =>
			declineInvitationFn({ data: { invitationId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: invitationKeys.my(),
			});
		},
	});

	return { accept, decline };
}
