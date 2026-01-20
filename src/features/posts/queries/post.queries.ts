import { queryOptions } from "@tanstack/react-query";
import { getPostById, getPosts } from "../services/post.services";

export const POST_QUERY_KEY = "posts";

export const postsQueryOptions = queryOptions({
	queryKey: [POST_QUERY_KEY],
	queryFn: () => getPosts(),
});

export const postByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: [POST_QUERY_KEY, id],
		queryFn: () => getPostById({ data: id }),
	});
