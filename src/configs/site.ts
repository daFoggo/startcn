/**
 * Cấu hình thông tin cơ bản của website như title, description và default metadata.
 * Được sử dụng tập trung cho việc hiển thị page title và hỗ trợ SEO.
 */
export const SITE_CONFIG = {
	metadata: {
		title: "Agentick",
		description:
			"An intelligent task management platform powered by AI Agents. Actively tracks progress, analyzes personal schedules, and delivers proactive risk forecasting to prevent project delays.",
		keywords: [
			"AI",
			"Project Management",
			"AI Agent",
			"Task Management",
			"Risk Forecasting",
			"Smart Productivity",
		],
	},
	app: {
		title: "Agentick",
		slogan: "Smart Project Management with AI Active Tracking",
	},
} as const;

export type TSiteConfig = typeof SITE_CONFIG;
