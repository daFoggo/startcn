import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/layouts/dashboard";
import { PostsTable, postsQueryOptions } from "@/features/posts";

export const Route = createFileRoute("/(app)/dashboard/posts/")({
    staticData: {
        hideBreadcrumb: true,
    },
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(postsQueryOptions);
    },
    component: PostsPage,
});

function PostsPage() {
    const postsQuery = useSuspenseQuery(postsQueryOptions);
    const posts = postsQuery.data;
    return (
        <>
            <PageTitle title="Posts" />
            <PostsTable posts={posts} />
        </>
    );
}
