import type { ComponentType } from "react";

export interface Team {
	id: string;
	name: string;
	logo: ComponentType<{ className?: string }>;
	plan: string;
}
