import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "../queries/user.queries";
import { deleteUser, postUser, putUser } from "../services/user.services";
import type { User } from "../types/user.types";

export const usePostUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: User) => postUser({ data: userData }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [USER_QUERY_KEY],
			});
		},
	});
};

export const usePutUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: User) => putUser({ data: userData }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [USER_QUERY_KEY],
			});
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteUser({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [USER_QUERY_KEY],
			});
		},
	});
};
