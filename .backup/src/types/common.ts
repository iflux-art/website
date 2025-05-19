/**
 * 通用类型定义
 */

// 导航项定义
export interface NavItem {
  key: string;
  label: string;
  href?: string;
}

// 搜索分类定义
export interface SearchCategory {
  id: string;
  label: string;
}

// 搜索项定义
export interface SearchItem {
  id: number;
  title: string;
  category: string;
  url: string;
}

// 站点元数据定义
export interface SiteMetadata {
  title: string;
  description: string;
  author: string;
}
