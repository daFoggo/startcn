import type { IBigCalendarEvent } from "@/types/big-calendar";
import { EVENT_TYPE_OPTIONS } from "./constants";
import type { TEvent, TEventType } from "./schemas";

/**
 * Lấy cấu hình màu sắc, icon, label của một loại event cụ thể.
 * @param type Loại event từ hệ thống (TEventType)
 */
export function getEventTypeConfig(type: TEventType) {
	return (
		EVENT_TYPE_OPTIONS.find((opt) => opt.value === type) ||
		EVENT_TYPE_OPTIONS[0]
	);
}

/**
 * Adapter function: Chuyển đổi dữ liệu Event từ server (TEvent)
 * sang dạng chuẩn mà BigCalendar cần (IBigCalendarEvent).
 * Nơi đây chịu trách nhiệm mapping cấu hình màu sắc từ feature xuống base component.
 */
export function mapEventToCalendarEvent(event: TEvent): IBigCalendarEvent {
	const config = getEventTypeConfig(event.type);

	return {
		id: event.id,
		title: event.title,
		start: new Date(event.start_time),
		end: new Date(event.end_time),
		color: config.calendarColor,
		meta: {
			type: event.type,
			description: event.description,
			location: event.task_id ? `Task: ${event.task_id}` : undefined,
		},
	};
}
