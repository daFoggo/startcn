import { createServerFn } from "@tanstack/react-start";
import { mainClient } from "@/lib/api-client";
import { mapSearchParams } from "@/lib/search-params-factory";
import type { Post } from "../types/post.types";
import { type PostsSearch, postsSearchSchema } from "../utils/schemas";

export const getPosts = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => postsSearchSchema.parse(data))
	.handler(async ({ data }) => {
		const searchParams = new URLSearchParams();
		const d = data as PostsSearch;

		if (d.title) searchParams.set("title_like", d.title);
		if (d.body) searchParams.set("body_like", d.body);

		mapSearchParams(d, searchParams);

		const response = await mainClient.get("posts", {
			searchParams,
		});

		const jsonData = await response.json<Post[]>();
		const totalHeader = response.headers.get("x-total-count");
		const total = totalHeader ? Number.parseInt(totalHeader, 10) : 100;

		return {
			data: jsonData,
			pageCount: Math.ceil(total / (data.perPage || 10)),
			total,
		};
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
