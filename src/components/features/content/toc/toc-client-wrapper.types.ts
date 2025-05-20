/**
 * toc-client-wrapper 组件类型定义
 */

import { Heading } from "./toc-improved.types";

/**
 * 目录客户端包装组件属性
 */
export interface TableOfContentsClientWrapperProps {
  /**
   * 标题项数组
   */
  headings: Heading[];
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 自定义标题
   * @default "目录"
   */
  title?: string;
}
