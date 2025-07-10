/**
 * UI 相关 Hooks 类型定义
 */

/**
 * 主题切换配置
 */
export interface UseThemeOptions {
  /** 默认主题 */
  defaultTheme?: "light" | "dark" | "system";
  /** 存储键名 */
  storageKey?: string;
  /** 是否启用系统主题检测 */
  enableSystem?: boolean;
}

/**
 * 搜索配置
 */
export interface UseSearchOptions {
  /** 搜索类型 */
  type?: "blog" | "docs" | "all";
  /** 搜索延迟（毫秒） */
  debounceMs?: number;
  /** 最小搜索字符数 */
  minLength?: number;
  /** 最大结果数 */
  maxResults?: number;
}
