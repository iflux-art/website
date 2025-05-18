/**
 * 通用类型定义
 */

// 支持的语言类型
export type Language = "zh" | "en";

// 语言项定义
export interface LanguageItem {
  code: Language;
  name: string;
  flag: string;
}

// 导航项定义
export interface NavItem {
  key: string;
  labelKey: string;
  href?: string;
}

// 搜索分类定义
export interface SearchCategory {
  id: string;
  labelKey: string;
}

// 搜索项定义
export interface SearchItem {
  id: number;
  title: string;
  titleEn: string;
  category: string;
  url: string;
}

// 站点元数据定义
export interface SiteMetadata {
  title: Record<Language, string>;
  description: Record<Language, string>;
  author: string;
}

// 页面布局属性
export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
  pageTitle?: string;
}