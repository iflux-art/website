// Logo 组件 props
export interface LogoProps {
  /** Logo文本内容 */
  text?: string;
  /** 自定义类名 */
  className?: string;
}

// ContentDisplay 相关类型
export type ContentType = "blog" | "docs";
export interface ContentDisplayProps {
  contentType: ContentType;
  title: string;
  date?: string | null;
  category?: string;
  tags?: string[];
  wordCount?: number;
  children?: React.ReactNode;
  className?: string;
}

// ContentRenderer 组件 props
export interface ContentRendererProps {
  content: string;
  frontmatter?: Record<string, unknown>;
}

// RelatedPosts 组件 props
export interface RelatedPost {
  title: string;
  href: string;
  category?: string;
}
export interface RelatedPostsProps {
  posts: RelatedPost[];
  currentSlug: string[];
}

/**
 * 面包屑导航项接口
 */
export interface BreadcrumbItem {
  /**
   * 显示的标签文本
   */
  label: string;
  /**
   * 链接地址，如果不提供则显示为纯文本
   */
  href?: string;
}

/**
 * 面包屑导航组件属性
 */
export interface BreadcrumbProps {
  /**
   * 面包屑项目数组
   */
  items: BreadcrumbItem[];
  /**
   * 分隔符，默认为 '/'
   */
  separator?: React.ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
}
