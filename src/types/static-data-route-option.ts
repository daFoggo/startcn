// This file extends @tanstack/react-router types for breadcrumb support
// IMPORTANT: export {} is required to make this a module (not a global script)
// Without it, declaration merging won't work and the original module types are lost

export {};

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		/** Static title hoặc function để get title */
		getTitle?: () => string;
		/** Ẩn route khỏi breadcrumb */
		hideBreadcrumb?: boolean;
	}
}
