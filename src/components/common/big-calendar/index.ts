// ─── Root Component ───────────────────────────────────────────────────────────

// ─── Store ────────────────────────────────────────────────────────────────────
export {
	useBigCalendarStore,
	useCalendarActions,
	useCalendarCurrentDate,
	useCalendarView,
	useCalendarWeekStartsOn,
} from "@/stores/use-big-calendar-store";
// ─── Types (re-export từ global) ─────────────────────────────────────────────
export type {
	IBigCalendarEvent,
	IBigCalendarEventLayout,
	IBigCalendarProps,
	IBigCalendarSlotInfo,
	IBigCalendarStore,
	TCalendarView,
	TWeekStartDay,
} from "@/types/big-calendar";
export { BigCalendar } from "./big-calendar";
export { BigCalendarSkeleton } from "./big-calendar-skeleton";
export { BigCalendarDayHeader } from "./components/header/big-calendar-day-header";
// ─── Sub-components (composable) ─────────────────────────────────────────────
export { BigCalendarHeader } from "./components/header/big-calendar-header";
export { BigCalendarDayColumn } from "./components/week-view/big-calendar-day-column";
export {
	BigCalendarEventBlock,
	BigCalendarEventContent,
} from "./components/week-view/big-calendar-event-block";
export { BigCalendarEventPopover } from "./components/week-view/big-calendar-event-popover";
export { BigCalendarNowIndicator } from "./components/week-view/big-calendar-now-indicator";
export { BigCalendarTimeGutter } from "./components/week-view/big-calendar-time-gutter";
export { BigCalendarWeekView } from "./components/week-view/big-calendar-week-view";
