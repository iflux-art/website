"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DocCategory } from '@/types/docs';
import { AnimatedCard } from '@/components/ui/animated-card';

/**
 * 文档分类卡片组件属性
 *
 * @interface DocCategoryCardProps
 */
interface DocCategoryCardProps {
  /**
   * 文档分类
   */
  category: DocCategory;

  /**
   * 索引，用于动画延迟
   */
  index?: number;
}

/**
 * 文档分类卡片组件
 *
 * 用于显示文档分类，包括标题、描述和文档数量
 * 使用 AnimatedCard 组件实现动画效果
 *
 * @param {DocCategoryCardProps} props - 组件属性
 * @returns {JSX.Element} 文档分类卡片组件
 *
 * @example
 * ```tsx
 * <DocCategoryCard
 *   category={{
 *     id: "getting-started",
 *     title: "入门指南",
 *     description: "快速上手项目的基本使用方法",
 *     count: 5
 *   }}
 *   index={0}
 * />
 * ```
 */
export function DocCategoryCard({ category, index = 0 }: DocCategoryCardProps) {
  return (
    <AnimatedCard
      delay={index * 0.1}
      duration={0.7}
      variant="fade"
      className="h-full"
    >
      <Card key={category.id} className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <CardContent className="pt-6 flex-grow">
          <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
          <p className="text-muted-foreground">{category.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
          <Link
            href={`/docs/${category.id}`}
            className="text-sm font-medium flex items-center hover:text-primary transition-colors"
          >
            浏览文档
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <span className="text-xs text-muted-foreground">{category.count} 篇文章</span>
        </CardFooter>
      </Card>
    </AnimatedCard>
  );
}
