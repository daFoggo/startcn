import { z } from "zod";
import { createBaseSearchSchema } from "@/lib/search-params-factory";

export const postsSearchSchema = createBaseSearchSchema({
	title: z.string().optional(),
	body: z.string().optional(),
	userId: z.coerce.number().optional(),
});

export type PostsSearch = z.infer<typeof postsSearchSchema>;
