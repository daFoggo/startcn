import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as z from "zod";

const postThemeValidator = z.union([
	z.literal("light"),
	z.literal("dark"),
	z.literal("system"),
]);

export const storageKey = "_preferred-theme";

export type TTheme = z.infer<typeof postThemeValidator>;

export const resolveTheme = (
	theme: TTheme,
	prefersDark = false,
): "light" | "dark" =>
	theme === "system" ? (prefersDark ? "dark" : "light") : theme;

/**
 * Lấy tùy chọn giao diện (light hoặc dark) hiện tại từ cookie phía server.
 * Giúp đảm bảo giao diện người dùng nhất quán ngay khi trang vừa tải mà không bị nhấp nháy (FOUC).
 */
export const getThemeServerFn = createServerFn().handler(
	async () => {
		const storedTheme = getCookie(storageKey);
		return postThemeValidator.safeParse(storedTheme).success
			? (storedTheme as TTheme)
			: "system";
	},
);

/**
 * Cập nhật tùy chọn giao diện mới vào cookie phía server.
 * Hàm này yêu cầu đầu vào phải là "light" hoặc "dark" thông qua kiểm tra của zod.
 */
export const setThemeServerFn = createServerFn({ method: "POST" })
	.inputValidator(postThemeValidator)
	.handler(async ({ data }) => setCookie(storageKey, data));
