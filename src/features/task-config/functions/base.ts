import { z } from "zod";

export const withProjectId = <T extends z.ZodTypeAny>(payloadSchema: T) =>
	z.object({
		projectId: z.string(),
		payload: payloadSchema,
	});
