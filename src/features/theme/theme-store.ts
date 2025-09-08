import { create } from "zustand";
import type { ThemeState, ThemeStore } from "./theme-types";

// 初始状态
export const initialState: ThemeState = {
  theme: "system",
  resolvedTheme: "light",
  config: {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  mounted: false,
};

// 创建函数
export const createThemeStore = () => {
  return create<ThemeStore>()((set, _get) => ({
    // ...initialState,
    theme: "system",
    resolvedTheme: "light",
    config: {
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: false,
    },
    mounted: false,

    // Actions
    setTheme: theme => set({ theme }),
    setResolvedTheme: resolvedTheme => set({ resolvedTheme }),
    setConfig: config => set({ config }),
    setMounted: mounted => set({ mounted }),
    toggleTheme: () =>
      set(state => ({
        theme: state.theme === "dark" ? "light" : "dark",
      })),
    resetState: () =>
      set({
        ...initialState,
      }),
  }));
};

// 默认导出store实例
export const useThemeStore = createThemeStore();
