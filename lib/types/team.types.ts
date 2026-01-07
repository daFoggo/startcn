import type { ComponentType } from "react";

export interface ITeam {
  id: string;
  name: string;
  logo: ComponentType<{ className?: string }>;
  plan: string;
}
