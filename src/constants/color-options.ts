export interface IColorOption {
	label: string;
	value: string;
}

export const TAILWIND_500_COLORS = {
	slate: "#64748b",
	gray: "#6b7280",
	zinc: "#71717a",
	neutral: "#737373",
	stone: "#78716c",
	red: "#ef4444",
	orange: "#f97316",
	amber: "#f59e0b",
	yellow: "#eab308",
	lime: "#84cc16",
	green: "#22c55e",
	emerald: "#10b981",
	teal: "#14b8a6",
	cyan: "#06b6d4",
	sky: "#0ea5e9",
	blue: "#3b82f6",
	indigo: "#6366f1",
	violet: "#8b5cf6",
	purple: "#a855f7",
	fuchsia: "#d946ef",
	pink: "#ec4899",
	rose: "#f43f5e",
} as const;

export const TAILWIND_COLOR_OPTIONS: ReadonlyArray<IColorOption> = [
	{ label: "Slate", value: TAILWIND_500_COLORS.slate },
	{ label: "Gray", value: TAILWIND_500_COLORS.gray },
	{ label: "Zinc", value: TAILWIND_500_COLORS.zinc },
	{ label: "Neutral", value: TAILWIND_500_COLORS.neutral },
	{ label: "Stone", value: TAILWIND_500_COLORS.stone },
	{ label: "Red", value: TAILWIND_500_COLORS.red },
	{ label: "Orange", value: TAILWIND_500_COLORS.orange },
	{ label: "Amber", value: TAILWIND_500_COLORS.amber },
	{ label: "Yellow", value: TAILWIND_500_COLORS.yellow },
	{ label: "Lime", value: TAILWIND_500_COLORS.lime },
	{ label: "Green", value: TAILWIND_500_COLORS.green },
	{ label: "Emerald", value: TAILWIND_500_COLORS.emerald },
	{ label: "Teal", value: TAILWIND_500_COLORS.teal },
	{ label: "Cyan", value: TAILWIND_500_COLORS.cyan },
	{ label: "Sky", value: TAILWIND_500_COLORS.sky },
	{ label: "Blue", value: TAILWIND_500_COLORS.blue },
	{ label: "Indigo", value: TAILWIND_500_COLORS.indigo },
	{ label: "Violet", value: TAILWIND_500_COLORS.violet },
	{ label: "Purple", value: TAILWIND_500_COLORS.purple },
	{ label: "Fuchsia", value: TAILWIND_500_COLORS.fuchsia },
	{ label: "Pink", value: TAILWIND_500_COLORS.pink },
	{ label: "Rose", value: TAILWIND_500_COLORS.rose },
];
