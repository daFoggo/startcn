import { useRouter } from "@tanstack/react-router";
import {
	createContext,
	type PropsWithChildren,
	use,
	useEffect,
	useState,
	useTransition,
} from "react";
import { resolveTheme, setThemeServerFn, type TTheme } from "@/lib/theme";

type TResolvedTheme = "light" | "dark";

type TThemeContextVal = {
	theme: TTheme;
	resolvedTheme: TResolvedTheme;
	setTheme: (val: TTheme) => void;
	isPending: boolean;
};
type TThemeProviderProps = PropsWithChildren<{ theme: TTheme }>;

const ThemeContext = createContext<TThemeContextVal | null>(null);

/**
 * Provider quản lý trạng thái Light/Dark mode cho toàn bộ ứng dụng.
 * Xử lý việc đồng bộ hóa theme giữa Client-side state và Server-side cookie để tránh hiện tượng nhấp nháy (FOUC).
 */
export const ThemeProvider = ({
	children,
	theme: initialTheme,
}: TThemeProviderProps) => {
	const router = useRouter();
	const [theme, setThemeState] = useState<TTheme>(initialTheme);
	const [resolvedTheme, setResolvedTheme] = useState<TResolvedTheme>(() => {
		if (typeof window === "undefined") {
			return initialTheme === "dark" ? "dark" : "light";
		}

		return resolveTheme(
			initialTheme,
			window.matchMedia("(prefers-color-scheme: dark)").matches,
		);
	});
	const [isPending, startTransition] = useTransition();

	// Đồng bộ local state khi server side theme thay đổi
	useEffect(() => {
		setThemeState(initialTheme);
		setResolvedTheme(
			resolveTheme(
				initialTheme,
				window.matchMedia("(prefers-color-scheme: dark)").matches,
			),
		);
	}, [initialTheme]);

	// Cập nhật class list ngay lập tức để animation mượt mà
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(resolvedTheme);
	}, [resolvedTheme]);

	// Nếu theme đang theo hệ thống, lắng nghe thay đổi từ OS và cập nhật ngay
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const syncResolvedTheme = () => {
			setResolvedTheme(resolveTheme(theme, mediaQuery.matches));
		};

		syncResolvedTheme();

		if (theme !== "system") {
			return;
		}

		mediaQuery.addEventListener("change", syncResolvedTheme);
		return () => mediaQuery.removeEventListener("change", syncResolvedTheme);
	}, [theme]);

	const setTheme = (val: TTheme) => {
		// 1. Cập nhật UI ngay lập tức (Optimistic)
		setThemeState(val);

		// 2. Gọi server function trong background
		startTransition(async () => {
			try {
				await setThemeServerFn({ data: val });
				await router.invalidate();
			} catch (error) {
				// Rollback nếu lỗi
				setThemeState(initialTheme);
				console.error("Failed to sync theme to server:", error);
			}
		});
	};

	return (
		<ThemeContext value={{ theme, resolvedTheme, setTheme, isPending }}>
			{children}
		</ThemeContext>
	);
};

export const useTheme = () => {
	const val = use(ThemeContext);
	if (!val) throw new Error("useTheme called outside of ThemeProvider!");
	return val;
};
