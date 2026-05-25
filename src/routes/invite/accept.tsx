import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
	AcceptInviteCard,
	invitationDetailQueryOptions,
} from "@/features/invitations";
import { userMeQueryOptions } from "@/features/users";

export const Route = createFileRoute("/invite/accept")({
	validateSearch: z.object({
		id: z.string(),
	}),
	loaderDeps: ({ search: { id } }) => ({ id }),
	loader: async ({ context, deps: { id } }) => {
		// Prefetch invitation data
		await Promise.all([
			context.queryClient.ensureQueryData(invitationDetailQueryOptions(id)),
			context.queryClient.ensureQueryData(userMeQueryOptions()),
		]);
	},
	component: AcceptInvitePage,
});

function AcceptInvitePage() {
	const { id } = Route.useSearch();
	const { data: invitation } = useSuspenseQuery(
		invitationDetailQueryOptions(id),
	);
	const { data: currentUser, isLoading: isFetchingUser } = useQuery({
		...userMeQueryOptions(),
		retry: false,
	});

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
			<AcceptInviteCard
				invitation={invitation}
				currentUser={currentUser}
				isFetchingUser={isFetchingUser}
			/>
		</div>
	);
}
