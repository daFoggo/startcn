/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GithubDark } from "./githubDark";
import { GithubLight } from "./githubLight";

export const Github = ({ className }: { className?: string }) => {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	if (resolvedTheme === "dark") {
		return <GithubDark className={className} />;
	}

	return <GithubLight className={className} />;
};
