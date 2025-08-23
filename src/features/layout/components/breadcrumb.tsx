import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types/content-types';

interface BreadcrumbProps {
  /**
   * 面包屑项数组
   */
  items: BreadcrumbItem[];
  /**
   * 分隔符组件
   */
  separator?: React.ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 是否显示首页图标
   */
  showHomeIcon?: boolean;
  /**
   * 最大显示项数（超过时会省略中间部分）
   */
  maxItems?: number;
}

/**
 * 通用面包屑导航组件
 */
export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className = '',
  showHomeIcon = true,
  maxItems = 5,
}: BreadcrumbProps) {
  // 处理项目过多的情况
  const displayItems =
    items.length > maxItems
      ? [
          items[0], // 首页
          { label: '...', href: undefined }, // 省略号
          ...items.slice(-(maxItems - 2)), // 最后几项
        ]
      : items;

  return (
    <nav aria-label="面包屑导航" className={cn('flex items-center space-x-1 text-sm', className)}>
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground" aria-hidden="true">
                {separator}
              </span>
            )}

            {item.label === '...' ? (
              <span className="text-muted-foreground">...</span>
            ) : item.isCurrent || !item.href ? (
              <span
                className={cn(
                  'font-medium',
                  item.isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {index === 0 && showHomeIcon && (
                  <Home className="mr-1 inline h-4 w-4" aria-hidden="true" />
                )}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {index === 0 && showHomeIcon && (
                  <Home className="mr-1 inline h-4 w-4" aria-hidden="true" />
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * 简化的面包屑组件 - 直接从路径生成
 */
interface SimpleBreadcrumbProps {
  /**
   * 当前路径
   */
  pathname: string;
  /**
   * 路径段标签映射
   */
  labelMap?: Record<string, string>;
  /**
   * 自定义类名
   */
  className?: string;
}

export function SimpleBreadcrumb({
  pathname,
  labelMap = {},
  className = '',
}: SimpleBreadcrumbProps) {
  const segments = pathname.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = [{ label: '首页', href: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    items.push({
      label: labelMap[segment] || formatSegmentLabel(segment),
      href: isLast ? undefined : currentPath,
      isCurrent: isLast,
    });
  });

  return <Breadcrumb items={items} className={className} />;
}

/**
 * 格式化路径段为显示标签
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default Breadcrumb;
