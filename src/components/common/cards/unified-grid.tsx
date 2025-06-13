'use client';

import React from 'react';
import { cn } from '@/shared/utils/utils';
import { UnifiedCard, UnifiedCardProps } from '@/components/common/cards/unified-card';

/**
 * 统一网格组件属性
 */
export interface UnifiedGridProps {
  /**
   * 卡片列表
   */
  items?: UnifiedCardProps[];

  /**
   * 子元素
   */
  children?: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 列数
   * @default 3
   */
  columns?: 1 | 2 | 3 | 4;

  /**
   * 网格间距
   * @default "default"
   */
  gap?: 'small' | 'default' | 'large';

  /**
   * 卡片类型
   * 如果提供，将应用于所有卡片
   */
  type?: UnifiedCardProps['type'];

  /**
   * 卡片变体
   * 如果提供，将应用于所有卡片
   */
  variant?: UnifiedCardProps['variant'];
}

/**
 * 统一网格组件
 *
 * 用于显示卡片网格
 *
 * @example
 * ```tsx
 * // 使用卡片列表
 * <UnifiedGrid
 *   items={[
 *     { title: "卡片1", href: "/card1", description: "描述1" },
 *     { title: "卡片2", href: "/card2", description: "描述2" },
 *   ]}
 *   columns={3}
 * />
 *
 * // 使用子元素
 * <UnifiedGrid columns={2}>
 *   <UnifiedCard title="卡片1" href="/card1" />
 *   <UnifiedCard title="卡片2" href="/card2" />
 * </UnifiedGrid>
 * ```
 */
export function UnifiedGrid({
  items,
  children,
  className,
  columns = 3,
  gap = 'default',
  type,
  variant,
}: UnifiedGridProps) {
  // 网格列数样式
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  // 网格间距样式
  const gridGap = {
    small: 'gap-3',
    default: 'gap-6',
    large: 'gap-8',
  };

  return (
    <div className={cn('grid my-8', gridCols[columns], gridGap[gap], className)}>
      {items &&
        items.map((item, index) => (
          <UnifiedCard
            key={`${item.title}-${index}`}
            {...item}
            type={type || item.type}
            variant={variant || item.variant}
            _index={index}
          />
        ))}
      {children}
    </div>
  );
}

/**
 * @deprecated 使用 UnifiedGrid 替代，以下组件将在未来版本中移除
 */
export const ResourceGrid = UnifiedGrid;

/**
 * @deprecated 使用 UnifiedGrid 替代，以下组件将在未来版本中移除
 */
export const FriendLinkGrid = UnifiedGrid;

/**
 * @deprecated 使用 UnifiedGrid 替代，以下组件将在未来版本中移除
 */
export const MDXResourceGrid = UnifiedGrid;

/**
 * @deprecated 使用 UnifiedGrid 替代，以下组件将在未来版本中移除
 */
export const MDXFriendLinkGrid = UnifiedGrid;
