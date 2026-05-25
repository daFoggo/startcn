import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark")]);
const storageKey = "_preferred-theme";

export type TTheme = z.infer<typeof postThemeValidator>;

/**
 * Lấy tùy chọn giao diện (light hoặc dark) hiện tại từ cookie phía server.
 * Giúp đảm bảo giao diện người dùng nhất quán ngay khi trang vừa tải mà không bị nhấp nháy (FOUC).
 */
export const getThemeServerFn = createServerFn().handler(
	async () => (getCookie(storageKey) || "light") as TTheme,
);

/**
 * Cập nhật tùy chọn giao diện mới vào cookie phía server.
 * Hàm này yêu cầu đầu vào phải là "light" hoặc "dark" thông qua kiểm tra của zod.
 */
export const setThemeServerFn = createServerFn({ method: "POST" })
	.inputValidator(postThemeValidator)
	.handler(async ({ data }) => setCookie(storageKey, data));
