import { queryOptions } from "@tanstack/react-query";
import { getUserById, getUsers } from "../services/users.services";

export const USER_QUERY_KEY = "users";

export const usersQueryOptions = queryOptions({
	queryKey: [USER_QUERY_KEY],
	queryFn: () => getUsers(),
});

export const userByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: [USER_QUERY_KEY, id],
		queryFn: () => getUserById({ data: id }),
	});
