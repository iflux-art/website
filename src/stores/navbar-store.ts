import { create } from "zustand";
import { debounce } from "lodash";

// 导航栏状态类型
export interface NavbarState {
  direction: "up" | "down";
  position: number;
  showTitle: boolean;
  pageTitle: string;
  lastDirectionChange: number;
  isInitialized: boolean;
}

// 导航栏状态管理动作
export interface NavbarActions {
  setScrollPosition: (position: number) => void;
  setPageTitle: (title: string) => void;
  scrollToTop: () => void;
  initialize: () => void;
  resetNavbarState: () => void;
}

// 导航栏配置常量
export const NAVBAR_STATE_CONFIG = {
  scrollThreshold: 2,
  showThreshold: 60,
  hideThreshold: 80,
  // 添加防抖延迟，减少状态更新频率
  updateDebounceMs: 30,
} as const;

export interface NavbarStore extends NavbarState, NavbarActions {}

export const useNavbarStore = create<NavbarStore>(set => {
  // 创建防抖的滚动处理函数
  const debouncedSetState = debounce((newState: Partial<NavbarState>) => {
    set(newState);
  }, NAVBAR_STATE_CONFIG.updateDebounceMs);

  return {
    // 初始状态
    direction: "up",
    position: 0,
    showTitle: false,
    pageTitle: "",
    lastDirectionChange: 0,
    isInitialized: false,

    // Actions
    setScrollPosition: position =>
      set(state => {
        if (!state.isInitialized) return state;

        const now = Date.now();
        const newDirection = position > state.position ? "down" : "up";
        const directionChanged = newDirection !== state.direction;

        // 首页始终显示导航菜单
        if (state.pageTitle === "首页") {
          return {
            direction: newDirection,
            position,
            showTitle: false,
            lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
          };
        }

        // 忽略微小的滚动变化
        if (Math.abs(position - state.position) <= NAVBAR_STATE_CONFIG.scrollThreshold) {
          return state;
        }

        const newState: Partial<NavbarState> = {
          direction: newDirection,
          position,
          lastDirectionChange: directionChanged ? now : state.lastDirectionChange,
        };

        // 根据滚动方向和位置决定是否显示标题
        if (newDirection === "down" && position > NAVBAR_STATE_CONFIG.hideThreshold) {
          newState.showTitle = true; // 向下滚动且超过阈值时显示标题
        } else if (newDirection === "up") {
          newState.showTitle = false; // 向上滚动时隐藏标题
        }

        // 使用防抖更新状态
        debouncedSetState(newState);
        return state; // 立即返回当前状态，避免频繁更新
      }),

    setPageTitle: title => set({ pageTitle: title }),

    scrollToTop: () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },

    initialize: () => set({ isInitialized: true }),

    resetNavbarState: () => ({
      direction: "up",
      position: 0,
      showTitle: false,
      pageTitle: "",
      lastDirectionChange: 0,
      isInitialized: false,
    }),
  };
});
