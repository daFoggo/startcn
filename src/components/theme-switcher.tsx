"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/animate-ui/components/radix/switch";
import { useTheme } from "@/providers/theme-provider";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
	const { theme, setTheme } = useTheme();

	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	const isDark =
		theme === "dark" ||
		(theme === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);

	return (
		<Switch
			className={className}
			startIcon={<Sun />}
			endIcon={<Moon />}
			checked={isDark}
			onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
		/>
	);
};
