import type React from "react";

// ─── View ────────────────────────────────────────────────────────────────────

/** View hiện tại */
export type TCalendarView = "week" | "day";

/**
 * Ngày bắt đầu tuần — khớp với type của date-fns.
 * 0 = CN, 1 = T2, …, 6 = T7
 */
export type TWeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ─── Core Data Types ─────────────────────────────────────────────────────────

/**
 * Base event type của BigCalendar.
 * Mọi feature đều phải convert typing riêng → IBigCalendarEvent
 * trước khi truyền vào component.
 */
export interface IBigCalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	/**
	 * Màu sắc event: oklch string, hex, hoặc CSS custom property (vd: "var(--primary)").
	 * Nếu không set → fallback về màu primary mặc định.
	 */
	color?: string;
	/**
	 * Dữ liệu tuỳ ý từ feature — BigCalendar không đọc, chỉ pass lại
	 * qua renderEvent để feature tự xử lý.
	 */
	meta?: Record<string, unknown>;
}

/**
 * Thông tin về slot time khi user click vào grid.
 * Thường dùng để trigger dialog tạo event mới.
 */
export interface IBigCalendarSlotInfo {
	start: Date;
	end: Date;
	dayOfWeek: number;
}

/**
 * Layout đã được tính toán cho một event (sau khi resolve overlap).
 * Được truyền vào renderEvent để feature có thể custom UI
 * mà vẫn biết vị trí/kích thước chính xác.
 */
export interface IBigCalendarEventLayout {
	event: IBigCalendarEvent;
	/** px từ đầu day column */
	top: number;
	/** px chiều cao block */
	height: number;
	/** Cột trong nhóm overlap (0-based) */
	column: number;
	/** Tổng số cột trong nhóm overlap */
	totalColumns: number;
	/** Callback khi event được kéo thả */
	onDrop?: (event: IBigCalendarEvent, start: Date, end: Date) => void;
	/** Callback khi event được resize */
	onResize?: (event: IBigCalendarEvent, start: Date, end: Date) => void;
}

// ─── Store State ──────────────────────────────────────────────────────────────

/** Shape của Zustand BigCalendar store */
export interface IBigCalendarStore {
	// ── State ─────────────────────────────────────────────────────────────────
	view: TCalendarView;
	currentDate: Date;
	weekStartsOn: TWeekStartDay;

	// ── Actions ───────────────────────────────────────────────────────────────
	setView: (view: TCalendarView) => void;
	setCurrentDate: (date: Date) => void;
	goToday: () => void;
	goPrev: () => void;
	goNext: () => void;
	/** Reset store về giá trị mặc định (dùng khi unmount BigCalendar) */
	reset: (defaultDate?: Date, weekStartsOn?: TWeekStartDay) => void;
}

// ─── Component Props ──────────────────────────────────────────────────────────

/** Props của root component BigCalendar */
export interface IBigCalendarProps {
	events: IBigCalendarEvent[];

	// ── View / Navigation ────────────────────────────────────────────────────
	defaultView?: TCalendarView;
	defaultDate?: Date;
	/**
	 * Ngày bắt đầu tuần.
	 * 0 = CN, 1 = T2 (default). Khớp với date-fns `weekStartsOn`.
	 */
	weekStartsOn?: TWeekStartDay;

	// ── Callbacks ────────────────────────────────────────────────────────────
	onSelectEvent?: (event: IBigCalendarEvent) => void;
	onSelectSlot?: (slot: IBigCalendarSlotInfo) => void;
	onNavigate?: (date: Date, view: TCalendarView) => void;
	onEventDrop?: (event: IBigCalendarEvent, start: Date, end: Date) => void;
	onEventResize?: (event: IBigCalendarEvent, start: Date, end: Date) => void;

	// ── Render Customization ─────────────────────────────────────────────────
	/**
	 * Override toàn bộ event block.
	 * Nhận event data + layout đã tính (top, height, column, totalColumns).
	 */
	renderEvent?: (
		event: IBigCalendarEvent,
		layout: IBigCalendarEventLayout,
	) => React.ReactNode;

	/** Override toàn bộ header toolbar. */
	renderToolbar?: (date: Date, view: TCalendarView) => React.ReactNode;
	/** className bổ sung cho default header toolbar (khi không dùng renderToolbar). */
	headerClassName?: string;

	// ── Display Config ────────────────────────────────────────────────────────
	/** Hàm callback trả về className custom cho một ô slot cụ thể (dùng để style giờ nghỉ, ngày lễ...). */
	slotClassName?: (date: Date, hour: number) => string;
	/** Giờ bắt đầu hiển thị trong grid. Default: 0 */
	startHour?: number;
	/** Giờ kết thúc hiển thị trong grid. Default: 24 */
	endHour?: number;
	/** Giờ tự động cuộn tới khi khởi tạo. Default: none */
	scrollToHour?: number;
	/** Pixel per hour — quyết định chiều cao của mỗi giờ. Default: 60 */
	hourHeight?: number;

	className?: string;
}
