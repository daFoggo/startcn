import {
	type ColumnFiltersState,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	type TableOptions,
	type TableState,
	type Updater,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsJson,
	parseAsString,
	type SingleParser,
	type UseQueryStateOptions,
	useQueryState,
	useQueryStates,
} from "nuqs";
import * as React from "react";
import { z } from "zod";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { ExtendedColumnSort, QueryKeys } from "@/types/data-table";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const FILTERS_KEY = "filters";
const JOIN_OPERATOR_KEY = "joinOperator";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface UseDataTableProps<TData>
	extends Omit<
			TableOptions<TData>,
			| "state"
			| "pageCount"
			| "getCoreRowModel"
			| "manualFiltering"
			| "manualPagination"
			| "manualSorting"
		>,
		Required<Pick<TableOptions<TData>, "pageCount">> {
	initialState?: Omit<Partial<TableState>, "sorting"> & {
		sorting?: ExtendedColumnSort<TData>[];
	};
	queryKeys?: Partial<QueryKeys>;
	history?: "push" | "replace";
	debounceMs?: number;
	throttleMs?: number;
	clearOnDefault?: boolean;
	enableAdvancedFilter?: boolean;
	scroll?: boolean;
	shallow?: boolean;
	enableClientSide?: boolean;
	startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
	const {
		columns,
		pageCount = -1,
		initialState,
		queryKeys,
		history = "replace",
		debounceMs = DEBOUNCE_MS,
		throttleMs = THROTTLE_MS,
		clearOnDefault = false,
		enableAdvancedFilter = false,
		scroll = false,
		shallow = false,
		startTransition,
		...tableProps
	} = props;
	const pageKey = queryKeys?.page ?? PAGE_KEY;
	const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY;
	const sortKey = queryKeys?.sort ?? SORT_KEY;
	const filtersKey = queryKeys?.filters ?? FILTERS_KEY;
	const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY;

	const queryStateOptions = React.useMemo<
		Omit<UseQueryStateOptions<string>, "parse">
	>(
		() => ({
			history,
			scroll,
			shallow,
			throttleMs,
			debounceMs,
			clearOnDefault,
			startTransition,
		}),
		[
			history,
			scroll,
			shallow,
			throttleMs,
			debounceMs,
			clearOnDefault,
			startTransition,
		],
	);

	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
		initialState?.rowSelection ?? {},
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

	const [page, setPage] = useQueryState(
		pageKey,
		parseAsInteger.withOptions(queryStateOptions).withDefault(1),
	);
	const [perPage, setPerPage] = useQueryState(
		perPageKey,
		parseAsInteger
			.withOptions(queryStateOptions)
			.withDefault(initialState?.pagination?.pageSize ?? 10),
	);

	const pagination: PaginationState = React.useMemo(() => {
		return {
			pageIndex: page - 1, // zero-based index -> one-based index
			pageSize: perPage,
		};
	}, [page, perPage]);

	const onPaginationChange = React.useCallback(
		(updaterOrValue: Updater<PaginationState>) => {
			if (typeof updaterOrValue === "function") {
				const newPagination = updaterOrValue(pagination);
				void setPage(newPagination.pageIndex + 1);
				void setPerPage(newPagination.pageSize);
			} else {
				void setPage(updaterOrValue.pageIndex + 1);
				void setPerPage(updaterOrValue.pageSize);
			}
		},
		[pagination, setPage, setPerPage],
	);

	// Schema for validating sorting items
	const sortingItemSchema = z.object({
		id: z.string(),
		desc: z.boolean(),
	});

	const sortingParser = parseAsJson(z.array(sortingItemSchema).parse)
		.withOptions(queryStateOptions)
		.withDefault(initialState?.sorting ?? []);

	// For client-side mode, use local state to avoid nuqs flickering issues
	const [localSorting, setLocalSorting] = React.useState<SortingState>(
		initialState?.sorting ?? [],
	);

	// For server-side mode, use nuqs for URL persistence
	const [urlSorting, setUrlSorting] = useQueryState(sortKey, sortingParser);

	// Use local state for client-side, URL state for server-side
	const sorting = props.enableClientSide ? localSorting : urlSorting;

	const onSortingChange = React.useCallback(
		(updaterOrValue: Updater<SortingState>) => {
			if (typeof updaterOrValue === "function") {
				const currentSorting = props.enableClientSide
					? localSorting
					: urlSorting;
				const newSorting = updaterOrValue(currentSorting);
				if (props.enableClientSide) {
					setLocalSorting(newSorting);
				} else {
					setUrlSorting(newSorting as ExtendedColumnSort<TData>[]);
				}
			} else {
				if (props.enableClientSide) {
					setLocalSorting(updaterOrValue);
				} else {
					setUrlSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
				}
			}
		},
		[localSorting, urlSorting, setUrlSorting, props.enableClientSide],
	);

	const filterableColumns = React.useMemo(() => {
		if (enableAdvancedFilter) return [];

		return columns.filter((column) => column.enableColumnFilter);
	}, [columns, enableAdvancedFilter]);

	const filterParsers = React.useMemo(() => {
		if (enableAdvancedFilter) return {};

		return filterableColumns.reduce<
			Record<string, SingleParser<string> | SingleParser<string[]>>
		>((acc, column) => {
			if (column.meta?.options) {
				acc[column.id ?? ""] = parseAsArrayOf(
					parseAsString,
					ARRAY_SEPARATOR,
				).withOptions(queryStateOptions);
			} else {
				acc[column.id ?? ""] = parseAsString.withOptions(queryStateOptions);
			}
			return acc;
		}, {});
	}, [filterableColumns, queryStateOptions, enableAdvancedFilter]);

	const [filterValues, setFilterValues] = useQueryStates(filterParsers);

	const debouncedSetFilterValues = useDebouncedCallback(
		(values: typeof filterValues) => {
			void setPage(1);
			void setFilterValues(values);
		},
		debounceMs,
	);

	const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
		if (enableAdvancedFilter) return [];

		return Object.entries(filterValues).reduce<ColumnFiltersState>(
			(filters, [key, value]) => {
				if (value !== null) {
					const processedValue = Array.isArray(value)
						? value
						: typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
							? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
							: [value];

					filters.push({
						id: key,
						value: processedValue,
					});
				}
				return filters;
			},
			[],
		);
	}, [filterValues, enableAdvancedFilter]);

	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>(initialColumnFilters);

	// Sync columnFilters with URL state only for server-side mode
	// Skip for client-side mode to avoid flickering
	React.useEffect(() => {
		if (!props.enableClientSide) {
			setColumnFilters(initialColumnFilters);
		}
	}, [initialColumnFilters, props.enableClientSide]);

	const onColumnFiltersChange = React.useCallback(
		(updaterOrValue: Updater<ColumnFiltersState>) => {
			if (enableAdvancedFilter) return;

			setColumnFilters((prev) => {
				const next =
					typeof updaterOrValue === "function"
						? updaterOrValue(prev)
						: updaterOrValue;

				// Skip URL sync for client-side mode to avoid flickering
				if (!props.enableClientSide) {
					const filterUpdates = next.reduce<
						Record<string, string | string[] | null>
					>((acc, filter) => {
						if (filterableColumns.find((column) => column.id === filter.id)) {
							acc[filter.id] = filter.value as string | string[];
						}
						return acc;
					}, {});

					for (const prevFilter of prev) {
						if (!next.some((filter) => filter.id === prevFilter.id)) {
							filterUpdates[prevFilter.id] = null;
						}
					}

					debouncedSetFilterValues(filterUpdates);
				}
				return next;
			});
		},
		[
			debouncedSetFilterValues,
			filterableColumns,
			enableAdvancedFilter,
			props.enableClientSide,
		],
	);

	const table = useReactTable({
		...tableProps,
		columns,
		initialState,
		pageCount,
		state: {
			pagination,
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		defaultColumn: {
			...tableProps.defaultColumn,
			enableColumnFilter: false,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange,
		onSortingChange,
		onColumnFiltersChange,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		manualPagination: !props.enableClientSide,
		manualSorting: !props.enableClientSide,
		manualFiltering: !props.enableClientSide,
		meta: {
			...tableProps.meta,
			enableClientSide: props.enableClientSide,
			queryKeys: {
				page: pageKey,
				perPage: perPageKey,
				sort: sortKey,
				filters: filtersKey,
				joinOperator: joinOperatorKey,
			},
		},
	});

	return React.useMemo(
		() => ({ table, shallow, debounceMs, throttleMs }),
		[table, shallow, debounceMs, throttleMs],
	);
}
