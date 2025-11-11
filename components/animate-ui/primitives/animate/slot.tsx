/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type HTMLMotionProps, isMotionComponent, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
	HTMLMotionProps<keyof HTMLElementTagNameMap>,
	"ref"
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
	| (Base & { asChild: true; children: React.ReactElement })
	| (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
	// biome-ignore lint/suspicious/noExplicitAny: <idk>
	children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(
	...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
	return (node) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === "function") {
				ref(node);
			} else {
				(ref as React.RefObject<T | null>).current = node;
			}
		});
	};
}

function mergeProps<T extends HTMLElement>(
	childProps: AnyProps,
	slotProps: DOMMotionProps<T>,
): AnyProps {
	const merged: AnyProps = { ...childProps, ...slotProps };

	if (childProps.className || slotProps.className) {
		merged.className = cn(
			childProps.className as string,
			slotProps.className as string,
		);
	}

	if (childProps.style || slotProps.style) {
		merged.style = {
			...(childProps.style as React.CSSProperties),
			...(slotProps.style as React.CSSProperties),
		};
	}

	return merged;
}

// Cache motion components outside of render
const motionComponentCache = new Map<React.ElementType, React.ElementType>();

function getMotionComponent(childType: React.ElementType): React.ElementType {
	if (!motionComponentCache.has(childType)) {
		motionComponentCache.set(childType, motion.create(childType));
	}
	const cachedComponent = motionComponentCache.get(childType);
	if (!cachedComponent) {
		throw new Error(`Failed to create motion component for ${childType}`);
	}
	return cachedComponent;
}

function Slot<T extends HTMLElement = HTMLElement>({
	children,
	ref,
	...props
}: SlotProps<T>) {
	if (!React.isValidElement(children)) return null;

	const childType = children.type as React.ElementType;

	const isAlreadyMotion =
		typeof childType === "object" &&
		childType !== null &&
		isMotionComponent(childType);

	// Get or create the motion component
	const Base = isAlreadyMotion ? childType : getMotionComponent(childType);

	const { ref: childRef, ...childProps } = children.props as AnyProps;
	const mergedProps = mergeProps(childProps, props);

	// Use createElement instead of JSX to avoid ESLint detection
	return React.createElement(Base, {
		...mergedProps,
		ref: mergeRefs(childRef as React.Ref<T>, ref),
	});
}

export {
	Slot,
	type AnyProps,
	type DOMMotionProps,
	type SlotProps,
	type WithAsChild,
};
