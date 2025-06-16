/**
 * 首页配置文件
 * 统一管理首页的各种配置选项
 */

// 首页基础配置
export const HOME_CONFIG = {
  // 页面标题和描述
  title: '智能搜索与AI对话',
  subtitle: '探索知识，创造可能',
  description: '集成本地搜索、联网搜索和AI对话的智能平台',

  // 搜索配置
  search: {
    placeholder: '有什么可以帮助您的吗？',
    maxResults: 8,
    debounceDelay: 300,
    minQueryLength: 1,
  },

  // AI对话配置
  ai: {
    defaultModel: 'none',
    maxMessageHistory: 50,
    typingDelay: 50,
    maxTokens: 2000,
  },

  // 背景效果配置
  background: {
    defaultStyle: 'default',
    particleCount: 50,
    animationSpeed: 'slow',
    enableParallax: true,
  },

  // 动画配置
  animation: {
    fadeInDuration: 300,
    slideInDuration: 400,
    hoverTransition: 200,
    enableReducedMotion: true,
  },

  // 响应式断点
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },

  // 主题配置
  theme: {
    enableSystemTheme: true,
    defaultTheme: 'system',
    enableThemeTransition: true,
  },

  // 性能配置
  performance: {
    enableVirtualization: true,
    enableServiceWorker: false,
    cacheStrategy: 'networkFirst',
  },

  // 功能开关
  features: {
    enableLocalSearch: true,
    enableWebSearch: true,
    enableAIChat: true,
    enableVoiceInput: false,
    enableKeyboardShortcuts: true,
    enableAnalytics: false,
  },

  // 键盘快捷键
  shortcuts: {
    focusSearch: 'cmd+k',
    clearSearch: 'escape',
    submitSearch: 'enter',
    toggleTheme: 'cmd+shift+t',
  },

  // API配置
  api: {
    searchEndpoint: '/api/search',
    chatEndpoint: '/api/chat',
    timeout: 10000,
    retryAttempts: 3,
  },

  // 缓存配置
  cache: {
    searchResults: {
      ttl: 5 * 60 * 1000, // 5分钟
      maxSize: 100,
    },
    aiResponses: {
      ttl: 30 * 60 * 1000, // 30分钟
      maxSize: 50,
    },
  },
} as const;

// 开发环境配置
export const DEV_CONFIG = {
  enableDebugMode: process.env.NODE_ENV === 'development',
  showPerformanceMetrics: false,
  enableMockData: false,
  logLevel: 'info',
} as const;

// 生产环境配置
export const PROD_CONFIG = {
  enableAnalytics: true,
  enableErrorReporting: true,
  enablePerformanceMonitoring: true,
  compressionLevel: 'high',
} as const;

// 根据环境选择配置
export const ENV_CONFIG = process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;

// 合并配置
export const FINAL_CONFIG = {
  ...HOME_CONFIG,
  ...ENV_CONFIG,
} as const;

// 配置类型定义
export type HomeConfig = typeof HOME_CONFIG;
export type DevConfig = typeof DEV_CONFIG;
export type ProdConfig = typeof PROD_CONFIG;
export type FinalConfig = typeof FINAL_CONFIG;
