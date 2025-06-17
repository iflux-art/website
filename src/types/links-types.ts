import type { ComponentType } from 'react';

/**
 * 网址导航数据类型定义
 */

export interface LinksItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: 'image' | 'emoji' | 'text';
  tags: string[];
  featured?: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinksCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface LinksData {
  categories: LinksCategory[];
  items: LinksItem[];
}

export interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: 'image' | 'emoji' | 'text';
  tags: string[];
  featured: boolean;
  category: string;
}

export interface Link {
  title: string;
  url: string;
  description: string;
  tags: string[];
  icon?: ComponentType<{ className?: string }>;
}

export interface Subcategory {
  title: string;
  links: Link[];
}
