import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/layouts/dashboard";
import { PostsTable, postsQueryOptions } from "@/features/posts";
import { postsSearchSchema } from "@/features/posts/utils/schemas";

export const Route = createFileRoute("/(app)/dashboard/posts/")({
	staticData: {
		hideBreadcrumb: true,
	},
	validateSearch: (search) => postsSearchSchema.parse(search),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(postsQueryOptions(deps));
	},
	component: PostsPage,
});

function PostsPage() {
	const search = Route.useSearch();
	const postsQuery = useQuery({
		...postsQueryOptions(search),
		placeholderData: keepPreviousData,
	});

	const { data: posts, pageCount } = postsQuery.data || {
		data: [],
		pageCount: 1,
	};

	return (
		<>
			<PageTitle title="Posts" />
			<PostsTable
				posts={posts}
				pageCount={pageCount}
				isLoading={postsQuery.isLoading}
			/>
		</>
	);
}
