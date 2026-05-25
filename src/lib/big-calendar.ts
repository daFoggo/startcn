import {
	addDays,
	addWeeks,
	endOfWeek,
	format,
	isWithinInterval,
	startOfWeek,
	subWeeks,
} from "date-fns";
import type {
	IBigCalendarEvent,
	IBigCalendarEventLayout,
	TWeekStartDay,
} from "@/types/big-calendar";

// ─── Constants ────────────────────────────────────────────────────────────────

export const CALENDAR_HOUR_HEIGHT = 60; // px per hour (default)
export const CALENDAR_DEFAULT_START_HOUR = 0;
export const CALENDAR_DEFAULT_END_HOUR = 24;
export const CALENDAR_DEFAULT_WEEK_STARTS_ON: TWeekStartDay = 1; // Monday

// ─── Week Helpers ─────────────────────────────────────────────────────────────

/**
 * Trả về mảng 7 ngày (Date[]) của tuần chứa `date`.
 */
export function getCalendarWeekDays(
	date: Date,
	weekStartsOn: TWeekStartDay,
): Date[] {
	const start = startOfWeek(date, { weekStartsOn });
	return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Ngày đầu tuần chứa `date`.
 */
export function getCalendarWeekStart(
	date: Date,
	weekStartsOn: TWeekStartDay,
): Date {
	return startOfWeek(date, { weekStartsOn });
}

/**
 * Ngày cuối tuần chứa `date`.
 */
export function getCalendarWeekEnd(
	date: Date,
	weekStartsOn: TWeekStartDay,
): Date {
	return endOfWeek(date, { weekStartsOn });
}

/**
 * Lùi một tuần.
 */
export function calendarNavigatePrev(date: Date): Date {
	return subWeeks(date, 1);
}

/**
 * Tiến một tuần.
 */
export function calendarNavigateNext(date: Date): Date {
	return addWeeks(date, 1);
}

/**
 * Range title cho week view.
 * VD: "Apr 28 – May 04, 2025"
 */
export function formatCalendarWeekRange(
	date: Date,
	weekStartsOn: TWeekStartDay,
): string {
	const start = getCalendarWeekStart(date, weekStartsOn);
	const end = getCalendarWeekEnd(date, weekStartsOn);
	const startStr = format(start, "MMM d");
	const endStr = format(end, "MMM d, yyyy");
	return `${startStr} – ${endStr}`;
}

// ─── Time Slot Helpers ────────────────────────────────────────────────────────

export interface ICalendarTimeSlot {
	hour: number;
	/** Label hiển thị, vd "09:00" */
	label: string;
}

/**
 * Tạo mảng các hour slot từ startHour (inclusive) đến endHour (exclusive).
 */
export function getCalendarTimeSlots(
	startHour: number,
	endHour: number,
): ICalendarTimeSlot[] {
	return Array.from({ length: endHour - startHour }, (_, i) => {
		const hour = startHour + i;
		return {
			hour,
			label: `${String(hour).padStart(2, "0")}:00`,
		};
	});
}

// ─── Position Calculation ─────────────────────────────────────────────────────

/**
 * Top offset (px) cho một thời điểm trong ngày tương ứng với startHour.
 */
export function getCalendarTopOffset(
	date: Date,
	startHour: number,
	hourHeight: number,
): number {
	const minutes = (date.getHours() - startHour) * 60 + date.getMinutes();
	return Math.max(0, (minutes / 60) * hourHeight);
}

/**
 * Chiều cao (px) của event dựa trên duration.
 * Tối thiểu bằng 1/4 hourHeight (15 phút).
 */
export function getCalendarEventHeight(
	start: Date,
	end: Date,
	hourHeight: number,
): number {
	const durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
	return Math.max((durationMinutes / 60) * hourHeight, hourHeight / 4);
}

/**
 * Tính Date từ top offset (px) trong day column.
 */
export function getCalendarDateFromOffset(
	top: number,
	day: Date,
	startHour: number,
	hourHeight: number,
): Date {
	const totalMinutes = (top / hourHeight) * 60;
	const hours = Math.floor(totalMinutes / 60) + startHour;
	const minutes = Math.round(totalMinutes % 60);

	const date = new Date(day);
	date.setHours(hours, minutes, 0, 0);
	return date;
}

/**
 * Snap pixel value vào lưới (mặc định 15 phút).
 */
export function snapToGrid(
	value: number,
	hourHeight: number,
	stepMinutes = 15,
): number {
	const pixelsPerStep = (stepMinutes / 60) * hourHeight;
	return Math.round(value / pixelsPerStep) * pixelsPerStep;
}

// ─── Event Filtering ──────────────────────────────────────────────────────────

/**
 * Lọc time-based events (không phải allDay) thuộc về một ngày cụ thể.
 * Bao gồm cả events span qua nhiều ngày.
 */
export function getCalendarEventsForDay(
	events: IBigCalendarEvent[],
	day: Date,
): IBigCalendarEvent[] {
	const dayStart = new Date(day);
	dayStart.setHours(0, 0, 0, 0);
	const dayEnd = new Date(day);
	dayEnd.setHours(23, 59, 59, 999);

	return events.filter((event) => {
		if (event.allDay) return false;
		return (
			isWithinInterval(event.start, { start: dayStart, end: dayEnd }) ||
			isWithinInterval(event.end, { start: dayStart, end: dayEnd }) ||
			(event.start <= dayStart && event.end >= dayEnd)
		);
	});
}

/**
 * Lọc allDay events thuộc về một ngày cụ thể.
 */
export function getCalendarAllDayEventsForDay(
	events: IBigCalendarEvent[],
	day: Date,
): IBigCalendarEvent[] {
	const dayStart = new Date(day);
	dayStart.setHours(0, 0, 0, 0);
	const dayEnd = new Date(day);
	dayEnd.setHours(23, 59, 59, 999);

	return events.filter(
		(event) => event.allDay && event.start <= dayEnd && event.end >= dayStart,
	);
}

// ─── Overlap Layout Algorithm ─────────────────────────────────────────────────

interface IEventWithInterval {
	event: IBigCalendarEvent;
	startMs: number;
	endMs: number;
}

/**
 * Tính IBigCalendarEventLayout[] cho danh sách events trong một ngày.
 * Xử lý overlap bằng greedy column assignment algorithm.
 *
 * Logic:
 * 1. Sort events by start time (tie-break: longer event first)
 * 2. Với mỗi event, assign vào cột đầu tiên không bị overlap
 * 3. Xác định totalColumns cho mỗi event = số cột trong overlap group
 */
export function computeCalendarEventLayout(
	events: IBigCalendarEvent[],
	day: Date,
	startHour: number,
	endHour: number,
	hourHeight: number,
): IBigCalendarEventLayout[] {
	if (events.length === 0) return [];

	const dayStart = new Date(day);
	dayStart.setHours(startHour, 0, 0, 0);
	const dayEnd = new Date(day);
	dayEnd.setHours(endHour, 0, 0, 0);

	// Clamp start/end về ranh giới hiển thị của ngày để tránh overflow grid
	const withInterval: IEventWithInterval[] = events
		.map((event) => {
			const startMs = Math.max(event.start.getTime(), dayStart.getTime());
			const endMs = Math.min(event.end.getTime(), dayEnd.getTime());
			return { event, startMs, endMs };
		})
		.filter((item) => item.startMs < item.endMs) // Loại bỏ events nằm ngoài range hiển thị
		.sort((a, b) => a.startMs - b.startMs || b.endMs - a.endMs);

	// Greedy column assignment: mỗi column là một mảng events đã được xếp
	const columns: IEventWithInterval[][] = [];

	for (const item of withInterval) {
		let placed = false;
		for (const col of columns) {
			const lastInCol = col[col.length - 1];
			if (lastInCol && lastInCol.endMs <= item.startMs) {
				col.push(item);
				placed = true;
				break;
			}
		}
		if (!placed) {
			columns.push([item]);
		}
	}

	// Map event.id → column index
	const colIndexMap = new Map<string, number>();
	columns.forEach((col, colIdx) => {
		col.forEach((item) => {
			colIndexMap.set(item.event.id, colIdx);
		});
	});

	// Với mỗi event, đếm số cột trong overlap group của nó
	const totalColumnsMap = new Map<string, number>();
	for (const item of withInterval) {
		const overlapping = withInterval.filter(
			(other) => other.startMs < item.endMs && other.endMs > item.startMs,
		);
		const maxCol = Math.max(
			...overlapping.map((o) => colIndexMap.get(o.event.id) ?? 0),
		);
		totalColumnsMap.set(item.event.id, maxCol + 1);
	}

	return withInterval.map(({ event, startMs, endMs }) => {
		const startDate = new Date(startMs);
		const endDate = new Date(endMs);
		return {
			event,
			top: getCalendarTopOffset(startDate, startHour, hourHeight),
			height: getCalendarEventHeight(startDate, endDate, hourHeight),
			column: colIndexMap.get(event.id) ?? 0,
			totalColumns: totalColumnsMap.get(event.id) ?? 1,
		};
	});
}

// ─── Date Formatting Helpers ──────────────────────────────────────────────────

/** Format day column header: { dayName: "Mon", dayNum: "28" } */
export function formatCalendarDayHeader(date: Date): {
	dayName: string;
	dayNum: string;
} {
	return {
		dayName: format(date, "EEE"),
		dayNum: format(date, "d"),
	};
}

/** Kiểm tra xem hai Date có cùng ngày (year/month/date) không */
export function isSameCalendarDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}
