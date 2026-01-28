import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";
import type { Address, Company } from "../types/users.types";

export const usersTable = pgTable("users_table", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	username: text("username").notNull(),
	email: text("email").notNull(),
	address: jsonb("address").$type<Address>().notNull(),
	phone: text("phone").notNull(),
	website: text("website").notNull(),
	company: jsonb("company").$type<Company>().notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
