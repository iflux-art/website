// layout-toc-types.ts

/**
 * 目录组件相关类型
 */
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface TocProps {
  headings: TocHeading[];
  className?: string;
  title?: string;
  adaptive?: boolean;
  adaptiveOffset?: number;
}
