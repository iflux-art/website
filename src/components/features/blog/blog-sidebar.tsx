import React from 'react';
import { AdaptiveSidebar } from '@/components/ui/adaptive-sidebar';
import { Heading } from '@/components/ui/table-of-contents';

/**
 * 博客侧边栏组件属性
 */
export interface BlogSidebarProps {
  /**
   * 文章标题列表，用于生成目录
   */
  headings: Heading[];
}

/**
 * 博客侧边栏组件
 *
 * 用于显示博客文章的侧边栏，包括目录
 * 使用自适应侧边栏组件显示文章目录
 *
 * @param {BlogSidebarProps} props - 组件属性
 * @returns {JSX.Element} 博客侧边栏组件
 *
 * @example
 * ```tsx
 * <BlogSidebar
 *   headings={[{ id: "intro", text: "Introduction", level: 2 }]}
 * />
 * ```
 */
export function BlogSidebar({ headings }: BlogSidebarProps) {
  return <AdaptiveSidebar headings={headings} className="pr-1" />;
}
