/**
 * @description Card được dùng chung cho toàn bộ phản hồi từ Backend.
 */
export interface TBaseResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * @description Search options dùng chung cho các response có phân trang/filter.
 */
export interface TBaseSearchOptions<
	TPageSize extends number | "all" = number,
	TOrdering extends string | null = string,
> {
	page: number;
	page_size: TPageSize;
	ordering: TOrdering;
	total_count: number;
}

/**
 * @description Shape response dùng chung cho các API list/find.
 */
export interface TBaseFindResponse<
	TItem,
	TSearchOptions extends TBaseSearchOptions<
		number | "all",
		string | null
	> = TBaseSearchOptions<number | "all", string | null>,
> {
	founds: TItem[];
	search_options: TSearchOptions;
}
