/**
 * toc-improved 组件类型定义
 */

/**
 * 标题项类型
 */
export interface Heading {
  /**
   * 标题ID
   */
  id: string;
  
  /**
   * 标题文本
   */
  text: string;
  
  /**
   * 标题级别（1-6）
   */
  level: number;
}

/**
 * 目录组件属性
 */
export interface TableOfContentsProps {
  /**
   * 标题项数组
   */
  headings: Heading[];
  
  /**
   * 自定义类名
   */
  className?: string;
}
