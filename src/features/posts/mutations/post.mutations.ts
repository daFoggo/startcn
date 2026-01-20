import { useMutation, useQueryClient } from "@tanstack/react-query";
import { POST_QUERY_KEY } from "../queries/post.queries";
import { deletePost, postPost, putPost } from "../services/post.services";
import type { Post } from "../types/post.types";

export const useCreatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (postData: Post) => postPost({ data: postData }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [POST_QUERY_KEY],
			});
		},
	});
};

export const useUpdatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (postData: Post) => putPost({ data: postData }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [POST_QUERY_KEY],
			});
		},
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deletePost({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [POST_QUERY_KEY],
			});
		},
	});
};
