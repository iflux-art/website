/**
 * API 相关类型定义
 * 包含API响应、错误、配置等类型
 */

// ==================== API 响应类型 ====================

/** API 响应基础结构 */
export interface ApiResponse<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  code?: string | number;
  /** 响应消息 */
  message?: string;
}

/** API 错误类型 */
export interface ApiError {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string | number;
  /** 错误详情 */
  details?: unknown;
  /** 错误堆栈 */
  stack?: string;
}

// ==================== 配置相关类型 ====================

/** 缓存配置 */
export interface CacheConfig {
  /** 默认缓存时间（毫秒） */
  defaultTtl: number;
  /** 长缓存时间（毫秒） */
  longTtl: number;
  /** 短缓存时间（毫秒） */
  shortTtl: number;
}

/** 主题配置 */
export interface ThemeConfig {
  /** 默认主题 */
  defaultTheme: "light" | "dark" | "system";
  /** 可用主题列表 */
  themes: ("light" | "dark" | "system")[];
  /** 是否启用主题切换 */
  enableToggle: boolean;
  /** 主题存储键名 */
  storageKey: string;
}

/** 安全配置 */
export interface SecurityConfig {
  /** 内容安全策略 */
  csp: Record<string, string[]>;
  /** 安全头配置 */
  headers: Record<string, string>;
  /** 是否启用HTTPS重定向 */
  httpsRedirect: boolean;
}

/** 性能配置 */
export interface PerformanceConfig {
  /** 图片优化配置 */
  images: {
    /** 默认质量 */
    quality: number;
    /** 默认格式 */
    format: "webp" | "avif" | "jpeg";
    /** 是否启用懒加载 */
    lazyLoading: boolean;
  };
  /** 字体配置 */
  fonts: {
    /** 字体显示策略 */
    display: "auto" | "block" | "swap" | "fallback" | "optional";
    /** 预加载字体 */
    preload: string[];
  };
}

// ==================== AI 聊天相关类型 ====================

/** 聊天消息结构 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** AI 聊天 API 请求体 */
export interface ApiRequestBody {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  model?: string;
}
