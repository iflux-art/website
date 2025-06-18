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

interface GenerateBreadcrumbsOptions {
  /**
   * 基础路径，如 'blog' 或 'docs'
   */
  basePath: string;

  /**
   * URL slug 数组
   */
  slug: string[];

  /**
   * 元数据映射，用于自定义标签
   */
  meta?: Record<string, { title?: string }>;

  /**
   * 当前项的标题（可选）
   */
  currentTitle?: string;

  /**
   * 起始项目的标签，如 "博客" 或 "文档"
   */
  startLabel: string;

  /**
   * 处理每个片段的回调函数
   */
  segmentProcessor?: (
    segment: string,
    index: number,
    meta?: Record<string, { title?: string }>
  ) => string;
}

/**
 * 生成面包屑导航项
 */
export function generateBreadcrumbs({
  basePath,
  slug,
  meta,
  currentTitle,
  startLabel,
  segmentProcessor,
}: GenerateBreadcrumbsOptions): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: startLabel, href: `/${basePath}` }];
  let currentPath = '';

  slug.forEach((segment, index) => {
    const isLastSegment = index === slug.length - 1;
    currentPath += `/${segment}`;

    const label = segmentProcessor
      ? segmentProcessor(segment, index, meta)
      : isLastSegment && currentTitle
        ? currentTitle
        : segment;

    if (isLastSegment) {
      items.push({ label });
    } else {
      items.push({ label, href: `/${basePath}${currentPath}` });
    }
  });

  return items;
}

interface BlogBreadcrumbProps {
  slug: string[];
  title: string;
}

export function createBlogBreadcrumbs({ slug, title }: BlogBreadcrumbProps): BreadcrumbItem[] {
  return generateBreadcrumbs({
    basePath: 'blog',
    slug,
    currentTitle: title,
    startLabel: '博客',
  });
}

interface DocBreadcrumbProps {
  slug: string[];
  title?: string;
  meta?: Record<string, { title?: string }>;
}

export function createDocBreadcrumbs({ slug, title, meta }: DocBreadcrumbProps): BreadcrumbItem[] {
  return generateBreadcrumbs({
    basePath: 'docs',
    slug,
    currentTitle: title,
    meta,
    startLabel: '文档',
    segmentProcessor: (segment, index, meta) => {
      if (meta?.[segment]?.title) {
        return meta[segment].title;
      }
      return title && index === slug.length - 1 ? title : segment;
    },
  });
}
