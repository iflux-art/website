import { create } from "zustand";
import type { ThemeProviderProps } from "next-themes";

// 主题状态类型
export interface ThemeState {
  // 当前主题
  theme: "light" | "dark" | "system";

  // 已解析的主题（实际应用的主题）
  resolvedTheme: "light" | "dark";

  // 主题配置
  config: Omit<ThemeProviderProps, "children">;

  // 状态标志
  mounted: boolean;
}

// 主题状态管理动作
export interface ThemeActions {
  setTheme: (theme: "light" | "dark" | "system") => void;
  setResolvedTheme: (resolvedTheme: "light" | "dark") => void;
  setConfig: (config: Omit<ThemeProviderProps, "children">) => void;
  setMounted: (mounted: boolean) => void;
  toggleTheme: () => void;
  resetThemeState: () => void;
}

export interface ThemeStore extends ThemeState, ThemeActions {}

// 比较两个配置对象是否相等
const isConfigEqual = (
  config1: Omit<ThemeProviderProps, "children">,
  config2: Omit<ThemeProviderProps, "children">
): boolean => {
  return (
    config1.attribute === config2.attribute &&
    config1.defaultTheme === config2.defaultTheme &&
    config1.enableSystem === config2.enableSystem &&
    config1.disableTransitionOnChange === config2.disableTransitionOnChange
  );
};

export const useThemeStore = create<ThemeStore>(set => ({
  // 初始状态
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

  setConfig: config =>
    set(state => {
      // 只有当配置真正改变时才更新
      if (!isConfigEqual(state.config, config)) {
        return { config };
      }
      return state;
    }),

  setMounted: mounted => set({ mounted }),

  toggleTheme: () =>
    set(state => ({
      theme: state.resolvedTheme === "dark" ? "light" : "dark",
    })),

  resetThemeState: () => ({
    theme: "system",
    resolvedTheme: "light",
    config: {
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: false,
    },
    mounted: false,
  }),
}));
