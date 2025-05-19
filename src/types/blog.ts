/**
 * 博客相关类型定义
 * @module types/blog
 */

/**
 * 博客文章
 * 
 * @interface BlogPost
 */
export interface BlogPost {
  /**
   * 文章唯一标识（URL 路径）
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
  
  /**
   * 发布日期
   */
  date?: string;
  
  /**
   * 标签列表
   */
  tags: string[];
  
  /**
   * 作者
   */
  author?: string;
  
  /**
   * 作者头像
   */
  authorAvatar?: string | null;
  
  /**
   * 作者简介
   */
  authorBio?: string;
  
  /**
   * 是否已发布
   */
  published?: boolean;
}

/**
 * 博客文章元数据
 * 
 * @interface BlogPostMeta
 */
export interface BlogPostMeta {
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
  date?: string;
  
  /**
   * 标签列表
   */
  tags: string[];
  
  /**
   * 作者
   */
  author?: string;
  
  /**
   * 作者头像
   */
  authorAvatar?: string | null;
  
  /**
   * 作者简介
   */
  authorBio?: string;
  
  /**
   * 是否已发布
   */
  published?: boolean;
}

/**
 * 相关文章
 * 
 * @interface RelatedPost
 */
export interface RelatedPost {
  /**
   * 文章唯一标识（URL 路径）
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

/**
 * 标题（用于目录）
 * 
 * @interface Heading
 */
export interface Heading {
  /**
   * 标题 ID
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
 * 标签统计
 * 
 * @interface TagCount
 */
export interface TagCount {
  /**
   * 标签名称
   */
  tag: string;
  
  /**
   * 文章数量
   */
  count: number;
}

/**
 * 按年份分组的博客文章
 * 
 * @interface PostsByYear
 */
export interface PostsByYear {
  /**
   * 年份作为键，对应的文章列表作为值
   */
  [year: string]: BlogPost[];
}
