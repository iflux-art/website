/**
 * blog-content 组件类型定义
 */

/**
 * 博客内容组件属性
 *
 * @interface BlogContentProps
 */
export interface BlogContentProps {
  /**
   * 文章标题
   */
  title: string;

  /**
   * 发布日期
   */
  date: string | null;

  /**
   * 文章内容（MDX 格式）
   */
  content: string;

  /**
   * 文章标签
   */
  tags?: string[];
}
