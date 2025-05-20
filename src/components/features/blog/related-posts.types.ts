/**
 * related-posts 组件类型定义
 */

import { RelatedPost } from '@/types/blog';

/**
 * 相关文章组件属性
 *
 * @interface RelatedPostsProps
 */
export interface RelatedPostsProps {
  /**
   * 相关文章列表
   */
  posts: RelatedPost[];
}
