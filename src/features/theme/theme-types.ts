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
