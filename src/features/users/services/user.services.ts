import { createServerFn } from "@tanstack/react-start";
import { mainClient } from "@/lib/api-client";
import type { User } from "../types/user.types";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	const response = await mainClient.get("users").json<User[]>();
	return response;
});

export const getUserById = createServerFn({ method: "GET" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const response = await mainClient.get(`users/${id}`).json<User>();
		return response;
	});

export const postUser = createServerFn({ method: "POST" })
	.inputValidator((userData: User) => userData)
	.handler(async ({ data: userData }) => {
		const response = await mainClient
			.post("users", {
				json: userData,
			})
			.json<User>();
		return response;
	});

export const putUser = createServerFn({ method: "POST" })
	.inputValidator((userData: User) => userData)
	.handler(async ({ data: userData }) => {
		const response = await mainClient
			.put(`users/${userData.id}`, {
				json: userData,
			})
			.json<User>();
		return response;
	});

export const deleteUser = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const response = await mainClient.delete(`users/${id}`).json<User>();
		return response;
	});
