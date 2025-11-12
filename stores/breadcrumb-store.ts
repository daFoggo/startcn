import { create } from 'zustand';
import type { ISidebarNavItem } from '@/lib/types/sidebar';

interface IBreadcrumbItem {
  title: string;
  url?: string;
  isActive?: boolean;
}

interface IBreadcrumbStore {
  breadcrumbs: IBreadcrumbItem[];
  setBreadcrumbs: (items: IBreadcrumbItem[]) => void;
  setBreadcrumbsFromNav: (navItems: ISidebarNavItem[]) => void;
  addBreadcrumb: (item: IBreadcrumbItem) => void;
  removeBreadcrumb: (index: number) => void;
  clearBreadcrumbs: () => void;
}

export const useBreadcrumbStore = create<IBreadcrumbStore>((set) => ({
  breadcrumbs: [],
  
  setBreadcrumbs: (items) => set({ breadcrumbs: items }),
  
  setBreadcrumbsFromNav: (navItems) => {
    const breadcrumbItems = navItems.map((item) => ({
      title: item.title,
      url: item.url,
      isActive: item.isActive,
    }));
    set({ breadcrumbs: breadcrumbItems });
  },
  
  addBreadcrumb: (item) =>
    set((state) => ({
      breadcrumbs: [...state.breadcrumbs, item],
    })),
  
  removeBreadcrumb: (index) =>
    set((state) => ({
      breadcrumbs: state.breadcrumbs.filter((_, i) => i !== index),
    })),
  
  clearBreadcrumbs: () => set({ breadcrumbs: [] }),
}));