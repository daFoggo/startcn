import { z } from "zod";

export const ApiDateSchema = z.string().datetime().or(z.date());

export const FindPageSchema = z.number().int().positive().optional();

export const FindPageSizeSchema = z.number().int().positive().optional();

export const FindPageSizeWithAllSchema = z
	.union([z.number().int().positive(), z.literal("all")])
	.optional();

export const FindOrderingSchema = z.string().optional();
