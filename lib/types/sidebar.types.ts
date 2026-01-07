import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type IconType =
  | LucideIcon
  | ComponentType<SVGProps<SVGSVGElement>>
  | ComponentType<{ className?: string }>;

export interface ISidebarNavItem {
  title: string;
  url: string;
  icon?: IconType;
  isActive?: boolean;
  items?: ISidebarNavSubItem[];
}

export interface ISidebarNavSubItem {
  title: string;
  url: string;
}

export interface ISidebarLayoutProps {
  children: ReactNode;
  variant?: "inset" | "sidebar" | "floating";
  header?: ReactNode;
  footer?: ReactNode;
  navigation: ISidebarNavItem[];
}
