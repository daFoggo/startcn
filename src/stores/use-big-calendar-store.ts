import { addDays, subDays } from "date-fns";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import {
	CALENDAR_DEFAULT_WEEK_STARTS_ON,
	calendarNavigateNext,
	calendarNavigatePrev,
} from "@/lib/big-calendar";
import type {
	IBigCalendarStore,
	TCalendarView,
	TWeekStartDay,
} from "@/types/big-calendar";

/**
 * Zustand store cho BigCalendar.
 *
 * Không persist vì calendar state là transient (chỉ sống trong session).
 * Mỗi instance BigCalendar nên gọi reset() khi mount để init đúng default.
 *
 * Tương tự pattern của useDashboardStore nhưng không dùng persist middleware.
 */
export const useBigCalendarStore = create<IBigCalendarStore>()((set) => ({
	// ── Initial State ──────────────────────────────────────────────────────────
	view: "week" as TCalendarView,
	currentDate: new Date(),
	weekStartsOn: CALENDAR_DEFAULT_WEEK_STARTS_ON,

	// ── Actions ────────────────────────────────────────────────────────────────
	setView: (view) => set({ view }),

	setCurrentDate: (date) => set({ currentDate: date }),

	goToday: () => set({ currentDate: new Date() }),

	goPrev: () =>
		set((state) => ({
			currentDate:
				state.view === "day"
					? subDays(state.currentDate, 1)
					: calendarNavigatePrev(state.currentDate),
		})),

	goNext: () =>
		set((state) => ({
			currentDate:
				state.view === "day"
					? addDays(state.currentDate, 1)
					: calendarNavigateNext(state.currentDate),
		})),

	reset: (defaultDate?: Date, weekStartsOn?: TWeekStartDay) =>
		set({
			view: "week",
			currentDate: defaultDate ?? new Date(),
			weekStartsOn: weekStartsOn ?? CALENDAR_DEFAULT_WEEK_STARTS_ON,
		}),
}));

// ─── Selector Hooks ────────────────────────────────────────────────────────────
// Fine-grained selectors để tránh re-render không cần thiết

export const useCalendarView = () => useBigCalendarStore((s) => s.view);

export const useCalendarCurrentDate = () =>
	useBigCalendarStore((s) => s.currentDate);

export const useCalendarWeekStartsOn = () =>
	useBigCalendarStore((s) => s.weekStartsOn);

/**
 * Trả về tất cả actions của BigCalendar.
 * Dùng useShallow để tránh tạo object mới mỗi render → infinite loop.
 * Actions (functions) trong Zustand là stable references, useShallow
 * chỉ so sánh shallow nên sẽ không trigger re-render thừa.
 */
export const useCalendarActions = () =>
	useBigCalendarStore(
		useShallow((s) => ({
			setView: s.setView,
			setCurrentDate: s.setCurrentDate,
			goToday: s.goToday,
			goPrev: s.goPrev,
			goNext: s.goNext,
			reset: s.reset,
		})),
	);
