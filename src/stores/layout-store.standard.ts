import { create } from "zustand";
import type { PageLayoutType, SidebarConfig } from "@/types";

// 状态接口
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

// 动作接口
export interface LayoutActions {
  setLayoutType: (layoutType: PageLayoutType) => void;
  setSidebars: (sidebars: SidebarConfig[]) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  setIsDesktop: (isDesktop: boolean) => void;
  setContainerConfig: (config: { className: string; minHeight: string }) => void;
  updateResponsiveState: (width: number) => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type LayoutDerivedState = Record<never, never>;

// 完整的Store接口
export interface LayoutStore extends LayoutState, LayoutActions {}

// 响应式断点配置
export const BREAKPOINTS = {
  mobile: 768, // md
  tablet: 1024, // lg
  desktop: 1280, // xl
} as const;

// 初始状态
export const initialState: LayoutState = {
  layoutType: "full-width",
  sidebars: [],
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  containerConfig: {
    className: "",
    minHeight: "min-h-screen",
  },
};

// 创建函数
export const createLayoutStore = () => {
  return create<LayoutStore>()((set, _get) => ({
    // ...initialState,
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
    setContainerConfig: containerConfig => set({ containerConfig }),
    updateResponsiveState: width => {
      const isMobile = width < BREAKPOINTS.tablet;
      const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
      const isDesktop = width >= BREAKPOINTS.desktop;

      set({
        isMobile,
        isTablet,
        isDesktop,
      });
    },
    resetState: () =>
      set({
        ...initialState,
      }),
  }));
};

// 默认导出store实例
export const useLayoutStore = createLayoutStore();
