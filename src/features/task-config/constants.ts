import { TAILWIND_500_COLORS } from "@/constants/color-options";

export const TASK_CONFIG_SECTIONS = [
	"statuses",
	"types",
	"priorities",
	"tags",
] as const;

export const TASK_CONFIG_ROUTE = "projects/{project_id}/task-config";

export const DEFAULT_TASK_STATUS_COLORS = [
	TAILWIND_500_COLORS.slate, // Backlog / Todo – neutral steel blue
	TAILWIND_500_COLORS.sky, // In Progress – primary sky blue
	TAILWIND_500_COLORS.amber, // In Review – warm amber
	TAILWIND_500_COLORS.green, // Done – mint green
	TAILWIND_500_COLORS.rose, // Blocked – rose red (softer than pure red)
	TAILWIND_500_COLORS.violet, // Custom / extra
] as const;

export const DEFAULT_TASK_TYPE_COLORS = [
	TAILWIND_500_COLORS.slate, // Task – neutral
	TAILWIND_500_COLORS.sky, // Feature – primary blue
	TAILWIND_500_COLORS.rose, // Bug – rose red
	TAILWIND_500_COLORS.violet, // Epic – purple
	TAILWIND_500_COLORS.green, // Sub-task – mint green
] as const;

export const DEFAULT_TASK_PRIORITY_COLORS = [
	TAILWIND_500_COLORS.slate, // Lowest – neutral
	TAILWIND_500_COLORS.green, // Low – calm green
	TAILWIND_500_COLORS.sky, // Medium – primary blue
	TAILWIND_500_COLORS.amber, // High – warm amber
	TAILWIND_500_COLORS.rose, // Highest – rose red
] as const;
