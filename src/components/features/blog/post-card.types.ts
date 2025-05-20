/**
 * post-card 组件类型定义
 */

/**
 * 博客文章卡片组件属性
 */
export interface PostCardProps {
  /**
   * 文章 slug
   */
  slug: string;
  
  /**
   * 文章标题
   */
  title: string;
  
  /**
   * 文章摘要
   */
  excerpt: string;
}
