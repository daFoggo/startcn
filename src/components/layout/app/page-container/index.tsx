import type * as React from "react";
import { cn } from "@/lib/utils";

interface IAppPageContainerProps extends React.ComponentProps<"div"> {
	fixedHeight?: boolean;
	size?: "small" | "default" | "large" | "full";
}

const pageContainerMaxWidth = {
	small: "max-w-192",
	default: "max-w-300",
	large: "max-w-400",
	full: "max-w-none",
};

export const AppPageContainer = ({
	className,
	fixedHeight,
	size = "default",
	...props
}: IAppPageContainerProps) => {
	return (
		<div
			className={cn(
				"mx-auto flex w-full flex-col gap-8 px-4 py-6 lg:px-6 xl:px-10",
				pageContainerMaxWidth[size],
				fixedHeight && "h-full min-h-0",
				className,
			)}
			{...props}
		/>
	);
};
