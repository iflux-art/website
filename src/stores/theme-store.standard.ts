import { create } from "zustand";
import type { ThemeProviderProps } from "next-themes";

// 状态接口
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

// 动作接口
export interface ThemeActions {
  setTheme: (theme: "light" | "dark" | "system") => void;
  setResolvedTheme: (resolvedTheme: "light" | "dark") => void;
  setConfig: (config: Omit<ThemeProviderProps, "children">) => void;
  setMounted: (mounted: boolean) => void;
  toggleTheme: () => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type ThemeDerivedState = Record<never, never>;

// 完整的Store接口
export interface ThemeStore extends ThemeState, ThemeActions {}

// 比较两个配置对象是否相等
// const _isConfigEqual = (
//   config1: Omit<ThemeProviderProps, "children">,
//   config2: Omit<ThemeProviderProps, "children">
// ): boolean => {
//   return (
//     config1.attribute === config2.attribute &&
//     config1.defaultTheme === config2.defaultTheme &&
//     config1.enableSystem === config2.enableSystem &&
//     config1.disableTransitionOnChange === config2.disableTransitionOnChange
//   );
// };

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
