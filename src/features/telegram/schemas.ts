import { z } from "zod";

export const TelegramLinkStartResponseSchema = z.object({
	link_url: z.url(),
	expires_at: z.string(),
});

export type TTelegramLinkStartResponse = z.infer<
	typeof TelegramLinkStartResponseSchema
>;
