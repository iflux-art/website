/**
 * blog-card 组件类型定义
 */

import { BlogPost } from "@/types/blog";

/**
 * 博客卡片组件属性
 *
 * @interface BlogCardProps
 */
export interface BlogCardProps {
  /**
   * 博客文章数据
   */
  post: BlogPost;

  /**
   * 索引，用于动画延迟
   */
  index: number;

  /**
   * 标签点击处理函数
   * 如果提供，则标签点击时调用此函数而不是导航到标签页面
   */
  onTagClick?: (tag: string) => void;
}
