'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

/**
 * 导航分类数据接口
 */
export interface NavigationCategory {
  /**
   * 分类ID
   */
  id: string;

  /**
   * 分类标题
   */
  title: string;

  /**
   * 分类描述
   */
  description: string;

  /**
   * 分类图标（emoji）
   */
  icon: string;

  /**
   * 分类背景颜色（Tailwind CSS 类名）
   */
  color: string;
}

/**
 * 导航卡片组件属性
 */
export interface NavigationCardProps {
  /**
   * 分类数据
   */
  category: NavigationCategory;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义链接文本，默认为"浏览"
   */
  linkText?: string;
}

/**
 * 导航卡片组件
 *
 * 用于显示导航页面中的分类卡片，支持自定义背景颜色和图标
 *
 * @example
 * ```tsx
 * <NavigationCard
 *   category={{
 *     id: "development",
 *     title: "开发工具",
 *     description: "各种开发相关的工具和资源",
 *     icon: "💻",
 *     color: "bg-blue-50 dark:bg-blue-950"
 *   }}
 * />
 * ```
 */
export function NavigationCard({
  category,
  className = '',
  linkText = '浏览',
}: NavigationCardProps) {
  return (
    <div className={className}>
      <Link href={`/navigation/${category.id}`}>
        <Card
          className={`h-full border-2 hover:border-primary transition-colors overflow-hidden hover:scale-[1.03] active:scale-[0.98]`}
        >
          <CardContent className={`p-6 ${category.color}`}>
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </CardContent>
          <CardFooter className="p-4 flex justify-end">
            <div className="flex items-center text-sm font-medium">
              {linkText}
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

/**
 * @deprecated 请使用 NavigationCard 替代 CategoryCard，CategoryCard 将在未来版本中移除
 */
export { NavigationCard as CategoryCard };

/**
 * @deprecated 请使用 NavigationCategory 替代 Category，Category 将在未来版本中移除
 */
export type { NavigationCategory as Category };
