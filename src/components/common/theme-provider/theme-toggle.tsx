import { Loader2, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/radix-switch";
import { useTheme } from ".";

export const ThemeToggle = () => {
	const { theme, setTheme, isPending } = useTheme();

	const toggleTheme = (checked: boolean) => {
		setTheme(checked ? "dark" : "light");
	};

	return (
		<Switch
			className="w-12"
			leftIcon={<Sun className="size-3.5!" />}
			rightIcon={<Moon className="size-3.5!" />}
			checked={theme === "dark"}
			onCheckedChange={toggleTheme}
			thumbIcon={
				isPending && (
					<Loader2 className="size-3! animate-spin text-muted-foreground" />
				)
			}
		/>
	);
};
