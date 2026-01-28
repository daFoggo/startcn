import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { InsertUser } from "../schemas/users.schema";
import { usersTable } from "../schemas/users.schema";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	const response = await db.select().from(usersTable);
	return response;
});

export const getUserById = createServerFn({ method: "GET" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const response = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));
		return response[0];
	});

export const postUser = createServerFn({ method: "POST" })
	.inputValidator((userData: InsertUser) => userData)
	.handler(async ({ data: userData }) => {
		const response = await db.insert(usersTable).values(userData).returning();
		return response[0];
	});

export const putUser = createServerFn({ method: "POST" })
	.inputValidator((userData: InsertUser & { id: number }) => userData)
	.handler(async ({ data: userData }) => {
		const response = await db
			.update(usersTable)
			.set(userData)
			.where(eq(usersTable.id, userData.id))
			.returning();
		return response[0];
	});

export const deleteUser = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const response = await db
			.delete(usersTable)
			.where(eq(usersTable.id, id))
			.returning();
		return response[0];
	});
