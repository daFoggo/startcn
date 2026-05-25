import { Coffee, Focus, ListTodo, type LucideIcon, Video } from "lucide-react";
import type { TEventType } from "./schemas";

export interface IEventTypeOption {
	value: TEventType;
	label: string;
	icon: LucideIcon;
	colorClass: string;
	bgClass: string;
	calendarColor: string;
}

export const EVENT_TYPE_OPTIONS: IEventTypeOption[] = [
	{
		value: "task",
		label: "Task",
		icon: ListTodo,
		colorClass: "text-sky-500",
		bgClass: "bg-sky-500/15",
		calendarColor: "#3BA6F1", // sky blue
	},
	{
		value: "meeting",
		label: "Meeting",
		icon: Video,
		colorClass: "text-violet-500",
		bgClass: "bg-violet-500/15",
		calendarColor: "#a78bfa", // lavender purple
	},
	{
		value: "focus_time",
		label: "Focus Time",
		icon: Focus,
		colorClass: "text-orange-500",
		bgClass: "bg-orange-500/15",
		calendarColor: "#fdba74", // peach orange
	},
	{
		value: "leave",
		label: "Leave",
		icon: Coffee,
		colorClass: "text-emerald-500",
		bgClass: "bg-emerald-500/15",
		calendarColor: "#97D6AE", // mint green
	},
];
