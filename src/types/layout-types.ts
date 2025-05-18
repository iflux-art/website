/**
 * 布局组件类型定义
 */
import { ReactNode } from 'react';

// 导航栏组件属性
export interface NavbarProps {
  className?: string;
}

// 页脚组件属性
export interface FooterProps {
  className?: string;
}

// 页面布局属性
export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
  pageTitle?: string;
}

// 移动菜单属性
export interface MobileMenuProps {
  className?: string;
}

// 导航项属性
export interface NavItemProps {
  item: {
    key: string;
    label: string;
    href?: string;
  };
  className?: string;
}

// 导航类别卡片属性
export interface CategoryCardProps {
  category: {
    title: string;
    description: string;
    icon?: string;
    href: string;
  };
  className?: string;
}

// 目录组件属性
export interface TocProps {
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
  className?: string;
}