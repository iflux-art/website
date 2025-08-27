import { create } from "zustand";
import type { PageLayoutType, SidebarConfig } from "@/types";

// 页面布局状态类型
export interface LayoutState {
  // 布局类型
  layoutType: PageLayoutType;

  // 侧边栏配置
  sidebars: SidebarConfig[];

  // 响应式状态
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // 容器配置
  containerConfig: {
    className: string;
    minHeight: string;
  };
}

// 页面布局状态管理动作
export interface LayoutActions {
  setLayoutType: (layoutType: PageLayoutType) => void;
  setSidebars: (sidebars: SidebarConfig[]) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  setIsDesktop: (isDesktop: boolean) => void;
  setContainerConfig: (config: { className?: string; minHeight?: string }) => void;
  updateResponsiveState: (width: number) => void;
  resetLayoutState: () => void;
}

export interface LayoutStore extends LayoutState, LayoutActions {}

// 响应式断点配置
export const BREAKPOINTS = {
  mobile: 768, // md
  tablet: 1024, // lg
  desktop: 1280, // xl
} as const;

export const useLayoutStore = create<LayoutStore>(set => ({
  // 初始状态
  layoutType: "full-width",
  sidebars: [],
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  containerConfig: {
    className: "",
    minHeight: "min-h-screen",
  },

  // Actions
  setLayoutType: layoutType => set({ layoutType }),

  setSidebars: sidebars => set({ sidebars }),

  setIsMobile: isMobile => set({ isMobile }),

  setIsTablet: isTablet => set({ isTablet }),

  setIsDesktop: isDesktop => set({ isDesktop }),

  setContainerConfig: config =>
    set(state => ({
      containerConfig: {
        ...state.containerConfig,
        ...config,
      },
    })),

  updateResponsiveState: width =>
    set({
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isDesktop: width >= BREAKPOINTS.tablet,
    }),

  resetLayoutState: () => ({
    layoutType: "full-width",
    sidebars: [],
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    containerConfig: {
      className: "",
      minHeight: "min-h-screen",
    },
  }),
}));
