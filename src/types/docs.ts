/**
 * 文档标题项类型
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
 * 自适应容器属性
 */
export interface AdaptiveContainerProps {
  /**
   * 子组件
   */
  children: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自适应定位的偏移量（单位：px）
   * @default 80
   */
  adaptiveOffset?: number;
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

  /**
   * 自定义标题
   * @default "目录"
   */
  title?: string;

  /**
   * 是否启用自适应定位
   * @default false
   */
  adaptive?: boolean;

  /**
   * 自适应定位的偏移量（单位：px）
   * @default 80
   */
  adaptiveOffset?: number;
}
