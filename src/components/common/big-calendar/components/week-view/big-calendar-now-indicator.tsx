import { useEffect, useRef, useState } from "react";
import { CALENDAR_HOUR_HEIGHT, getCalendarTopOffset } from "@/lib/big-calendar";

interface IBigCalendarNowIndicatorProps {
	startHour?: number;
	hourHeight?: number;
}

/**
 * Đường kẻ đỏ chỉ thời điểm hiện tại trong day column.
 * Tự cập nhật mỗi 60 giây.
 * Chỉ render khi giờ hiện tại nằm trong khoảng [startHour, endHour).
 */
export function BigCalendarNowIndicator({
	startHour = 0,
	hourHeight = CALENDAR_HOUR_HEIGHT,
}: IBigCalendarNowIndicatorProps) {
	const [now, setNow] = useState(() => new Date());
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(() => setNow(new Date()), 60_000);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const topPx = getCalendarTopOffset(now, startHour, hourHeight);

	return (
		<div
			className="pointer-events-none absolute right-0 left-0 z-20"
			style={{ top: topPx }}
		>
			{/* Circle dot bên trái */}
			<div className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rounded-full bg-destructive" />
			{/* Line ngang */}
			<div className="h-px w-full bg-destructive" />
		</div>
	);
}
