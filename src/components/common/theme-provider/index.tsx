import { useRouter } from "@tanstack/react-router";
import {
	createContext,
	type PropsWithChildren,
	use,
	useEffect,
	useState,
	useTransition,
} from "react";
import { setThemeServerFn, type TTheme } from "@/lib/theme";

type TThemeContextVal = {
	theme: TTheme;
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
	const [isPending, startTransition] = useTransition();

	// Đồng bộ local state khi server side theme thay đổi
	useEffect(() => {
		setThemeState(initialTheme);
	}, [initialTheme]);

	// Cập nhật class list ngay lập tức để animation mượt mà
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
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
		<ThemeContext value={{ theme, setTheme, isPending }}>
			{children}
		</ThemeContext>
	);
};

export const useTheme = () => {
	const val = use(ThemeContext);
	if (!val) throw new Error("useTheme called outside of ThemeProvider!");
	return val;
};
