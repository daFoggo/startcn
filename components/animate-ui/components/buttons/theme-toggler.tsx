"use client";

import type { VariantProps } from "class-variance-authority";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type * as React from "react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/animate-ui/components/buttons/icon";
import {
	type Resolved,
	type ThemeSelection,
	ThemeToggler as ThemeTogglerPrimitive,
	type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { cn } from "@/lib/utils";
import { Airplay } from "../../icons/airplay";
import { AnimateIcon } from "../../icons/icon";
import { MoonStar } from "../../icons/moon-star";
import { SunMedium } from "../../icons/sun-medium";

const getIcon = (
	effective: ThemeSelection,
	resolved: Resolved,
	modes: ThemeSelection[],
) => {
	const theme = modes.includes("system") ? effective : resolved;
	return theme === "system" ? (
		<AnimateIcon animateOnTap animateOnHover animateOnView>
			<Airplay />
		</AnimateIcon>
	) : theme === "dark" ? (
		<AnimateIcon animateOnTap animateOnHover animateOnView>
			<MoonStar />
		</AnimateIcon>
	) : (
		<AnimateIcon animateOnTap animateOnHover animateOnView>
			<SunMedium />
		</AnimateIcon>
	);
};

const getNextTheme = (
	effective: ThemeSelection,
	modes: ThemeSelection[],
): ThemeSelection => {
	const i = modes.indexOf(effective);
	if (i === -1) return modes[0];
	return modes[(i + 1) % modes.length];
};

type ThemeTogglerButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		modes?: ThemeSelection[];
		onImmediateChange?: ThemeTogglerPrimitiveProps["onImmediateChange"];
		direction?: ThemeTogglerPrimitiveProps["direction"];
	};

function ThemeTogglerButton({
	variant = "default",
	size = "default",
	modes = ["light", "dark", "system"],
	direction = "ltr",
	onImmediateChange,
	onClick,
	className,
	...props
}: ThemeTogglerButtonProps) {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Wait for next tick to ensure hydration is complete
	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timer);
	}, []);

	// Render a placeholder during SSR to match the initial client render
	if (!mounted) {
		return (
			<button
				data-slot="theme-toggler-button"
				className={cn(buttonVariants({ variant, size, className }))}
				disabled
				{...props}
			>
				<Sun />
			</button>
		);
	}

	return (
		<ThemeTogglerPrimitive
			theme={theme as ThemeSelection}
			resolvedTheme={resolvedTheme as Resolved}
			setTheme={setTheme}
			direction={direction}
			onImmediateChange={onImmediateChange}
		>
			{({ effective, resolved, toggleTheme }) => (
				<button
					data-slot="theme-toggler-button"
					className={cn(buttonVariants({ variant, size, className }))}
					onClick={(e) => {
						onClick?.(e);
						toggleTheme(getNextTheme(effective, modes));
					}}
					{...props}
				>
					{getIcon(effective, resolved, modes)}
				</button>
			)}
		</ThemeTogglerPrimitive>
	);
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
