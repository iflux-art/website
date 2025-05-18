/**
 * 国际化工具
 * 提供多语言支持和文本翻译功能
 */
import { SUPPORTED_LANGUAGES } from "./constants";

// 文本翻译字典
const translations = {
  // 导航菜单
  "nav.docs": {
    zh: "文档",
    en: "Docs",
  },
  "nav.blog": {
    zh: "博客",
    en: "Blog",
  },
  "nav.navigation": {
    zh: "导航",
    en: "Navigation",
  },
  "nav.friends": {
    zh: "友链",
    en: "Friends",
  },

  // 搜索相关
  "search.placeholder": {
    zh: "搜索内容...",
    en: "Search...",
  },
  "search.empty": {
    zh: "没有找到相关内容",
    en: "No results found",
  },
  "search.results": {
    zh: "搜索结果",
    en: "Search Results",
  },
  "search.category.pages": {
    zh: "页面",
    en: "Pages",
  },
  "search.category.docs": {
    zh: "文档",
    en: "Docs",
  },
  "search.category.blog": {
    zh: "博客",
    en: "Blog",
  },
  "search.category.navigation": {
    zh: "导航",
    en: "Navigation",
  },

  // 主题切换
  "theme.toggle": {
    zh: "切换主题",
    en: "Toggle theme",
  },
  "theme.light": {
    zh: "切换到暗色模式",
    en: "Switch to dark mode",
  },
  "theme.dark": {
    zh: "切换到亮色模式",
    en: "Switch to light mode",
  },

  // 语言切换
  "language.toggle": {
    zh: "切换语言",
    en: "Toggle language",
  },
  "language.zh": {
    zh: "切换到英文",
    en: "Switch to English",
  },
  "language.en": {
    zh: "切换到中文",
    en: "Switch to Chinese",
  },

  // 页脚
  "footer.copyright": {
    zh: "版权所有 © 2025 iFluxArt · 斐流艺创",
    en: "Copyright © 2025 iFluxArt · 斐流艺创",
  },
};

/**
 * 获取指定语言的文本翻译
 * @param key 翻译键
 * @param lang 语言代码
 * @returns 翻译后的文本
 */
export function getTranslation(key: string, lang: string = "zh"): string {
  // 检查语言是否支持
  const isValidLang = SUPPORTED_LANGUAGES.some((l) => l.code === lang);
  const safeLang = isValidLang ? lang : "zh";
  
  // 获取翻译
  const translation = translations[key as keyof typeof translations];
  
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return translation[safeLang as keyof typeof translation] || translation.zh;
}

/**
 * 创建翻译函数
 * @param lang 语言代码
 * @returns 翻译函数
 */
export function createTranslator(lang: string) {
  return (key: string) => getTranslation(key, lang);
}

/**
 * 获取当前浏览器语言
 * @returns 语言代码
 */
export function getBrowserLanguage(): string {
  if (typeof window === "undefined") return "zh";
  
  const browserLang = navigator.language.split("-")[0];
  const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === browserLang);
  
  return isSupported ? browserLang : "zh";
}