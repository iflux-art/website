/**
 * blog-section 组件类型定义
 */

/**
 * 博客文章类型
 */
export interface BlogPost {
  /**
   * 文章标题
   */
  title: string;
  
  /**
   * 文章摘要
   */
  excerpt: string;
  
  /**
   * 发布日期
   */
  date: string;
  
  /**
   * 文章 slug
   */
  slug: string;
  
  /**
   * 封面图片
   */
  coverImage?: string;
  
  /**
   * 阅读时间
   */
  readingTime?: string;
}
