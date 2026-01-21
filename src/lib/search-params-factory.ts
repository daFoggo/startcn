import { z } from "zod";

/**
 * Creates a standard search schema for data tables.
 * @param customShape Optional additional Zod shape to merge (e.g., for specific simple filters)
 */
const baseSearchParamShape = {
	page: z.coerce.number().default(1),
	perPage: z.coerce.number().default(10),
	sort: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.transform((val) => {
			if (Array.isArray(val)) return val.join(",");
			return val;
		}),
	filters: z.any().optional(),
	// Range filters (optional, common for simpler range implementation)
	from: z.string().optional(),
	to: z.string().optional(),
};

/**
 * Creates a standard search schema for data tables.
 * @param customShape Optional additional Zod shape to merge
 */
export function createBaseSearchSchema(): z.ZodObject<
	typeof baseSearchParamShape
>;
export function createBaseSearchSchema<T extends z.ZodRawShape>(
	customShape: T,
): z.ZodObject<typeof baseSearchParamShape & T>;
export function createBaseSearchSchema<T extends z.ZodRawShape>(
	customShape?: T,
) {
	if (customShape) {
		return z.object({
			...baseSearchParamShape,
			...customShape,
		});
	}
	return z.object(baseSearchParamShape);
}

export type BaseSearch = z.infer<ReturnType<typeof createBaseSearchSchema>>;

/**
 * Transforms standard table search params into URLSearchParams for JSONPlaceholder/JSON Server.
 * @param data The validated search data (from standard schema)
 * @param baseParams Optional existing URLSearchParams
 * @returns Populated URLSearchParams
 */
export const mapSearchParams = (
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic data record
	data: BaseSearch & Record<string, any>,
	baseParams = new URLSearchParams(),
) => {
	// Pagination
	if (data.page) baseParams.set("_page", data.page.toString());
	if (data.perPage) baseParams.set("_limit", data.perPage.toString());

	// Sorting
	if (data.sort) {
		const fields: string[] = [];
		const orders: string[] = [];
		const sorts = data.sort.split(",");

		for (const sortItem of sorts) {
			const [field, order] = sortItem.split(".");
			if (field) {
				fields.push(field);
				orders.push(order || "asc");
			}
		}

		if (fields.length > 0) {
			baseParams.set("_sort", fields.join(","));
			baseParams.set("_order", orders.join(","));
		}
	}

	// Advanced Filters (JSON or Array)
	if (data.filters) {
		try {
			// Handle both string (JSON) and array formats
			const filters =
				typeof data.filters === "string"
					? JSON.parse(data.filters)
					: data.filters;
			if (Array.isArray(filters)) {
				for (const filter of filters) {
					if (!filter.id) continue;

					const key = filter.id;
					const value = filter.value;

					if (value === undefined || value === null || value === "") continue;

					if (filter.variant === "date" || filter.variant === "range") {
						// Handle ranges if value is array if needed
					} else if (
						filter.operator === "contains" ||
						filter.operator === "iLike"
					) {
						baseParams.set(`${key}_like`, value.toString());
					} else {
						// Default to exact match
						baseParams.set(key, value.toString());
					}
				}
			}
		} catch {
			// Ignore parse errors
		}
	}

	// Merge any custom 'simple' fields that are not base fields
	const baseKeys = ["page", "perPage", "sort", "filters", "from", "to"];
	for (const [key, value] of Object.entries(data)) {
		if (
			!baseKeys.includes(key) &&
			value !== undefined &&
			value !== null &&
			value !== ""
		) {
			// Check for potential collision with advanced filters?
			// Prioritize advanced filters if they exist?
			// For now, if parameter is explicitly passed in URL, use it. (e.g. ?title=foo)

			// Map common string search fields to _like automatically?
			// No, safer to just pass exactly as is for flexibility.
			if (!baseParams.has(key) && !baseParams.has(`${key}_like`)) {
				baseParams.set(key, value.toString());
			}
		}
	}

	return baseParams;
};
