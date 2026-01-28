import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InsertUser, SelectUser } from "../schemas/users.schema";
import { deleteUser, postUser, putUser } from "../services/users.services";
import { USER_QUERY_KEY } from "./users.queries";

export const usePostUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: InsertUser) => postUser({ data: userData }),
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
		mutationFn: (userData: SelectUser) => putUser({ data: userData }),
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
