import { queryOptions } from "@tanstack/react-query";
import { getPostById, getPosts } from "../services/post.services";
import type { PostsSearch } from "../utils/schemas";

export const POST_QUERY_KEY = "posts";

export const postsQueryOptions = (params: PostsSearch) =>
	queryOptions({
		queryKey: [POST_QUERY_KEY, params],
		queryFn: () => getPosts({ data: params }),
	});

export const postByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: [POST_QUERY_KEY, id],
		queryFn: () => getPostById({ data: id }),
	});
