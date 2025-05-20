/**
 * blog-sidebar 组件类型定义
 */

import { Heading } from "@/types/blog";

/**
 * 博客侧边栏组件属性
 *
 * @interface BlogSidebarProps
 */
export interface BlogSidebarProps {
  /**
   * 文章标题列表，用于生成目录
   */
  headings: Heading[];
}
