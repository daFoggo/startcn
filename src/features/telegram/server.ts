import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { TTelegramLinkStartResponse } from "./schemas";

export async function startTelegramLink(): Promise<TTelegramLinkStartResponse> {
	const response = await api
		.post("telegram/link/start")
		.json<TBaseResponse<TTelegramLinkStartResponse>>();
	return response.data;
}
