/**
 * 目录组件相关类型
 */
export interface NavHeading {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  headings: NavHeading[];
  className?: string;
  title?: string;
  adaptive?: boolean;
  adaptiveOffset?: number;
}
