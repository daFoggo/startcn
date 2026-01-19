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

	return (
		<Switch
			className={className}
			startIcon={<Sun className="text-primary-foreground" />} // changed from leftIcon
			endIcon={<Moon className="text-muted-foreground" />} // changed from rightIcon
			checked={theme === "dark"}
			onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
		/>
	);
};
