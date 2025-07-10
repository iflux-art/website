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
