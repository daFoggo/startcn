export const DAYS_OF_WEEK = [
	{ id: 0, name: "Sunday", short: "Sun" },
	{ id: 1, name: "Monday", short: "Mon" },
	{ id: 2, name: "Tuesday", short: "Tue" },
	{ id: 3, name: "Wednesday", short: "Wed" },
	{ id: 4, name: "Thursday", short: "Thu" },
	{ id: 5, name: "Friday", short: "Fri" },
	{ id: 6, name: "Saturday", short: "Sat" },
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DISPLAY_ORDER_MON_SUN = [1, 2, 3, 4, 5, 6, 0];
