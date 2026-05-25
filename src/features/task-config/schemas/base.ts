import { z } from "zod";
import {
	FindOrderingSchema,
	FindPageSchema,
	FindPageSizeWithAllSchema,
} from "@/lib/zod-common";

export const BaseFindOptionsSchema = z.object({
	page: FindPageSchema,
	page_size: FindPageSizeWithAllSchema,
	ordering: FindOrderingSchema,
});

export const createFindOptionsSchema = <TShape extends z.ZodRawShape>(
	shape: TShape,
) => BaseFindOptionsSchema.extend(shape).optional();
