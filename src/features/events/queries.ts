import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { IBigCalendarEvent } from "@/types/big-calendar";
import { EVENT_TYPE_OPTIONS } from "./constants";
import {
	createEventFn,
	deleteEventFn,
	getEventByIdFn,
	getEventsFn,
	updateEventFn,
} from "./functions";
import type {
	TCreateEventInput,
	TEvent,
	TFindEventsInput,
	TUpdateEventInput,
} from "./schemas";

export const eventKeys = {
	all: ["events"] as const,
	lists: () => [...eventKeys.all, "list"] as const,
	list: (params?: TFindEventsInput) =>
		[...eventKeys.lists(), { params }] as const,
	details: () => [...eventKeys.all, "detail"] as const,
	detail: (eventId: string) => [...eventKeys.details(), eventId] as const,
};

export const formatToBigCalendarEvents = (
	events?: TEvent[],
): IBigCalendarEvent[] => {
	if (!events) return [];
	return events.map((event) => ({
		id: event.id,
		title: event.title,
		start: new Date(event.start_time),
		end: new Date(event.end_time),
		color: EVENT_TYPE_OPTIONS.find((opt) => opt.value === event.type)
			?.calendarColor,
		meta: {
			type: event.type,
			description: event.description,
			task_id: event.task_id,
			participant_ids: event.participant_ids,
			participants: event.participants,
		},
	}));
};

export const eventsQueryOptions = (params?: TFindEventsInput) =>
	queryOptions({
		queryKey: eventKeys.list(params),
		queryFn: () => getEventsFn({ data: params }),
		select: (data) => ({
			...data,
			formattedEvents: formatToBigCalendarEvents(data.founds),
		}),
	});

export const eventDetailQueryOptions = (eventId: string) =>
	queryOptions({
		queryKey: eventKeys.detail(eventId),
		queryFn: () => getEventByIdFn({ data: eventId }),
	});

export const useEventMutations = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: (payload: TCreateEventInput) =>
			createEventFn({ data: payload }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
		},
	});

	const update = useMutation({
		mutationFn: (payload: TUpdateEventInput) =>
			updateEventFn({ data: payload }),
		onSuccess: (_, { eventId }) => {
			queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
			queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
		},
	});

	const remove = useMutation({
		mutationFn: (eventId: string) => deleteEventFn({ data: eventId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
		},
	});

	return { create, update, remove };
};
