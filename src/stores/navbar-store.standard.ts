import { create } from "zustand";
import { debounceSync } from "@/utils/helpers";
import { createResetFunction } from "@/utils/store";

// 状态接口
export interface NavbarState {
  direction: "up" | "down";
  position: number;
  showTitle: boolean;
  pageTitle: string;
  lastDirectionChange: number;
  isInitialized: boolean;
}

// 动作接口
export interface NavbarActions {
  setScrollPosition: (position: number) => void;
  setPageTitle: (title: string) => void;
  scrollToTop: () => void;
  initialize: () => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type NavbarDerivedState = Record<never, never>;

// 完整的Store接口
export interface NavbarStore extends NavbarState, NavbarActions {}

// 导航栏配置常量
export const NAVBAR_STATE_CONFIG = {
  scrollThreshold: 2,
  showThreshold: 60,
  hideThreshold: 80,
  // 添加防抖延迟，减少状态更新频率
  debounceTime: 30,
} as const;

// 初始状态
export const initialState: NavbarState = {
  direction: "up",
  position: 0,
  showTitle: false,
  pageTitle: "",
  lastDirectionChange: 0,
  isInitialized: false,
};

// 创建标准化的重置函数
const resetStateFunc = createResetFunction(initialState);

// 创建函数
export const createNavbarStore = () => {
  return create<NavbarStore>()((set, _get) => {
    // 创建防抖的滚动处理函数
    const debouncedSetState = debounceSync((newState: Partial<NavbarState>) => {
      set(state => ({ ...state, ...newState }));
    }, NAVBAR_STATE_CONFIG.debounceTime);

    return {
      ...initialState,

      // Actions
      setScrollPosition: position => {
        set(state => {
          const distance = Math.abs(position - state.position);
          if (distance < NAVBAR_STATE_CONFIG.scrollThreshold) {
            return {};
          }

          const newDirection = position > state.position ? "down" : "up";
          const shouldUpdateDirection = newDirection !== state.direction;

          // 根据滚动位置决定是否显示页面标题
          const shouldShowTitle = position > NAVBAR_STATE_CONFIG.showThreshold;

          // 更新状态
          debouncedSetState({
            position,
            direction: newDirection,
            showTitle: shouldShowTitle,
            lastDirectionChange: shouldUpdateDirection ? Date.now() : state.lastDirectionChange,
          });

          return {
            position,
          };
        });
      },

      setPageTitle: pageTitle => set({ pageTitle }),

      scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        set({ position: 0, direction: "up" });
      },

      initialize: () => set({ isInitialized: true }),

      resetState: () => set(resetStateFunc()),
    };
  });
};

// 默认导出store实例
export const useNavbarStore = createNavbarStore();
