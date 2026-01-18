import type { LucideIcon } from 'lucide-react'
import type { ComponentType, ReactNode, SVGProps } from 'react'

export type IconType =
  | LucideIcon
  | ComponentType<SVGProps<SVGSVGElement>>
  | ComponentType<{ className?: string }>

export interface SidebarNavItem {
  title: string
  url?: string
  icon?: IconType
  isActive?: boolean
  items?: SidebarNavSubItem[]
}

export interface SidebarNavSubItem {
  title: string
  url: string
}

export interface SidebarLayoutProps {
  children: ReactNode
  variant?: 'inset' | 'sidebar' | 'floating'
  header?: ReactNode
  footer?: ReactNode
  navigation: SidebarNavItem[]
}
