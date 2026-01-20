import { createServerFn } from "@tanstack/react-start";
import { mainClient } from "@/lib/api-client";
import type { Post } from "../types/post.types";

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
	const response = await mainClient.get("posts").json<Post[]>();
	return response;
});

export const getPostById = createServerFn({ method: "GET" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const response = await mainClient.get(`posts/${id}`).json<Post>();
		return response;
	});

export const postPost = createServerFn({ method: "POST" })
	.inputValidator((postData: Post) => postData)
	.handler(async ({ data: postData }) => {
		const response = await mainClient
			.post("posts", {
				json: postData,
			})
			.json<Post>();
		return response;
	});

export const putPost = createServerFn({ method: "POST" })
	.inputValidator((postData: Post) => postData)
	.handler(async ({ data: postData }) => {
		const response = await mainClient
			.put(`posts/${postData.id}`, {
				json: postData,
			})
			.json<Post>();
		return response;
	});

export const deletePost = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const response = await mainClient.delete(`posts/${id}`).json<Post>();
		return response;
	});
