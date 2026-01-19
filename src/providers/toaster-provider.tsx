import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/providers/theme-provider";

export const ToasterProvider = () => {
	const { theme } = useTheme();

	return (
		<Toaster
			richColors
			closeButton
			theme={theme as "light" | "dark" | "system"}
		/>
	);
};
