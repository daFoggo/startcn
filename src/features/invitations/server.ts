import { api } from "@/lib/ky";
import type { TBaseResponse } from "@/types/api";
import "@tanstack/react-start/server-only";
import type { TInvitation } from "./schemas";

export async function fetchMyInvitations(): Promise<TInvitation[]> {
	const response = await api
		.get(`invitations/me`)
		.json<TBaseResponse<TInvitation[]>>();
	return response.data;
}

export async function fetchInvitationById(id: string): Promise<TInvitation> {
	const response = await api
		.get(`invitations/${id}`)
		.json<TBaseResponse<TInvitation>>();
	return response.data;
}

export async function acceptInvitation(id: string): Promise<TInvitation> {
	const response = await api
		.post(`invitations/${id}/accept`)
		.json<TBaseResponse<TInvitation>>();
	return response.data;
}

export async function declineInvitation(id: string): Promise<TInvitation> {
	const response = await api
		.post(`invitations/${id}/decline`)
		.json<TBaseResponse<TInvitation>>();
	return response.data;
}
