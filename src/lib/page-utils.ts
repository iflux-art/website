import type { Metadata } from 'next';
import type { PageMetadataOptions, PageLayoutType, PageContainerConfig } from '@/types/page-types';
import type { BreadcrumbItem } from '@/types/content-types';

/**
 * 生成页面元数据
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    author,
    type = 'website',
    publishedTime,
    modifiedTime,
    image,
    url,
  } = options;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      type: type as any,
      url,
      images: image ? [{ url: image }] : undefined,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };

  // 过滤掉 undefined 值
  return Object.fromEntries(
    Object.entries(metadata).filter(([_, value]) => value !== undefined)
  ) as Metadata;
}

/**
 * 获取布局对应的CSS类名
 */
export function getLayoutClassName(layout: PageLayoutType): string {
  const baseClasses = 'min-h-screen bg-background';

  switch (layout) {
    case 'full-width':
      return `${baseClasses} w-full`;
    case 'three-column':
    default:
      return baseClasses;
  }
}

/**
 * 获取容器CSS类名
 */
export function getContainerClassName(config: PageContainerConfig = {}): string {
  const { layout = 'full-width', className = '', minHeight = 'min-h-screen' } = config;

  const baseClasses = minHeight;
  const layoutClasses = getLayoutClassName(layout);

  return `${baseClasses} ${layoutClasses} ${className}`.trim();
}

/**
 * 生成面包屑导航数据
 */
export function generateBreadcrumbs(
  segments: string[],
  basePath: string = '',
  customLabels: Record<string, string> = {}
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: '首页',
      href: '/',
    },
  ];

  let currentPath = basePath;

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // 使用自定义标签或格式化segment
    const label = customLabels[segment] || formatSegmentLabel(segment);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isCurrent: isLast,
    });
  });

  return breadcrumbs;
}

/**
 * 格式化路径段为显示标签
 */
export function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 获取页面标题
 */
export function getPageTitle(title: string, siteName: string = ''): string {
  return siteName ? `${title} - ${siteName}` : title;
}

/**
 * 检查是否为移动端设备（服务端安全）
 */
export function isMobileUserAgent(userAgent: string = ''): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * 生成页面级的loading状态文本
 */
export function getLoadingText(type: string = '内容'): string {
  return `正在加载${type}...`;
}

/**
 * 生成页面级的错误文本
 */
export function getErrorText(type: string = '内容', action: string = '加载'): string {
  return `${action}${type}失败，请稍后重试`;
}

/**
 * 安全的JSON解析
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 创建页面URL
 */
export function createPageUrl(baseUrl: string, ...segments: (string | number)[]): string {
  const cleanSegments = segments
    .filter(segment => segment !== undefined && segment !== null && segment !== '')
    .map(segment => String(segment).replace(/^\/+|\/+$/g, ''));

  return [baseUrl.replace(/\/+$/, ''), ...cleanSegments].filter(Boolean).join('/');
}

/**
 * 验证页面参数
 */
export function validatePageParams(
  params: Record<string, any>,
  requiredFields: string[] = []
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(
    field => params[field] === undefined || params[field] === null || params[field] === ''
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 格式化发布时间
 */
export function formatPublishTime(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch {
    return undefined;
  }
}
