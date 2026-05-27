/**
 * Cấu hình thông tin cơ bản của website như title, description và default metadata.
 * Được sử dụng tập trung cho việc hiển thị page title và hỗ trợ SEO.
 */
export const SITE_CONFIG = {
	metadata: {
		title: "AnnoBot",
		description: "AnnoBot",
		keywords: ["AnnoBot", "tanstack-start", "react"],
	},
	app: {
		title: "AnnoBot",
		slogan: "AnnoBot",
	},
} as const;

export type TSiteConfig = typeof SITE_CONFIG;
