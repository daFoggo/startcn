"use client";

import { StarIcon } from "lucide-react";
import * as React from "react";
import {
	Particles,
	ParticlesEffect,
} from "@/components/animate-ui/primitives/effects/particles";
import {
	ScrollingNumberContainer as ScrollingNumberContainerPrimitive,
	type ScrollingNumberContainerProps as ScrollingNumberContainerPrimitiveProps,
	ScrollingNumberHighlight as ScrollingNumberHighlightPrimitive,
	ScrollingNumberItems as ScrollingNumberItemsPrimitive,
	ScrollingNumber as ScrollingNumberPrimitive,
} from "@/components/animate-ui/primitives/texts/scrolling-number";
import { cn } from "@/lib/utils";

function percentageBetween(value: number, min: number, max: number): number {
	return ((value - min) / (max - min)) * 100;
}

type GitHubStarsWheelProps = {
	username?: string;
	repo?: string;
	direction?: "btt" | "ttb";
	delay?: number;
	value?: number;
	step?: number;
} & Omit<
	ScrollingNumberContainerPrimitiveProps,
	"direction" | "number" | "step"
>;

function GitHubStarsWheel({
	username,
	repo,
	direction = "btt",
	itemsSize = 35,
	sideItemsCount = 2,
	delay = 0,
	step = 100,
	value,
	className,
	...props
}: GitHubStarsWheelProps) {
	const [stars, setStars] = React.useState(value ?? 0);
	const [currentStars, setCurrentStars] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);
	const roundedStars = React.useMemo(
		() => Math.round(stars / step) * step,
		[stars, step],
	);
	const isCompleted = React.useMemo(
		() => currentStars === roundedStars,
		[currentStars, roundedStars],
	);
	const fillPercentage = React.useMemo(
		() => percentageBetween(currentStars, 0, roundedStars),
		[currentStars, roundedStars],
	);

	React.useEffect(() => {
		if (value !== undefined && username && repo) return;

		const timeout = setTimeout(() => {
			fetch(`https://api.github.com/repos/${username}/${repo}`)
				.then((response) => response.json())
				.then((data) => {
					if (data && typeof data.stargazers_count === "number") {
						setStars(data.stargazers_count);
					}
				})
				.catch(console.error)
				.finally(() => setIsLoading(false));
		}, delay);

		return () => clearTimeout(timeout);
	}, [username, repo, value, delay]);

	return (
		!isLoading && (
			<ScrollingNumberContainerPrimitive
				key={direction}
				className={cn("w-28", className)}
				direction={direction}
				number={roundedStars}
				step={step}
				itemsSize={itemsSize}
				onNumberChange={setCurrentStars}
				{...props}
			>
				<div
					className="top-0 left-0 z-10 absolute bg-linear-to-t from-transparent to-background w-full"
					style={{
						height: `${itemsSize * sideItemsCount}px`,
					}}
				/>
				<div
					className="bottom-0 left-0 z-10 absolute bg-linear-to-b from-transparent to-background w-full"
					style={{
						height: `${itemsSize * sideItemsCount}px`,
					}}
				/>
				<ScrollingNumberPrimitive delay={delay}>
					<ScrollingNumberItemsPrimitive className="flex justify-start items-center pl-8" />
				</ScrollingNumberPrimitive>
				<ScrollingNumberHighlightPrimitive className="flex items-center bg-accent/40 pl-2 border rounded-md size-full">
					<Particles animate={isCompleted}>
						<StarIcon
							aria-hidden="true"
							className="fill-neutral-300 dark:fill-neutral-700 stroke-neutral-300 dark:stroke-neutral-700 size-4"
						/>
						<StarIcon
							aria-hidden="true"
							className="top-0 left-0 absolute fill-yellow-500 stroke-yellow-500 size-4"
							style={{
								clipPath: `inset(${100 - (isCompleted ? fillPercentage : fillPercentage - 10)}% 0 0 0)`,
							}}
						/>
						<ParticlesEffect
							delay={0.5}
							className="bg-yellow-500 rounded-full size-1"
						/>
					</Particles>
				</ScrollingNumberHighlightPrimitive>
			</ScrollingNumberContainerPrimitive>
		)
	);
}

export { GitHubStarsWheel, type GitHubStarsWheelProps };
