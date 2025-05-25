/**
 * 网址导航数据类型定义
 */

export interface NavigationItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: 'emoji' | 'image' | 'text';
  tags: string[];
  featured?: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface NavigationData {
  categories: NavigationCategory[];
  items: NavigationItem[];
}

export interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface NavigationFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: 'emoji' | 'image' | 'text';
  tags: string[];
  featured: boolean;
  category: string;
}
