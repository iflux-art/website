'use client';

import Link from 'next/link';
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
 * 使用博客文章卡片同款样式，但去掉日期和标签
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
    <AnimatedCard delay={index * 0.05} duration={0.7} variant="fade" className="h-full">
      <article className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full max-h-[500px]">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">{category.title}</h2>
          <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
            {category.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <Link href={`/docs/${category.id}`} className="text-primary hover:underline">
              浏览文档 →
            </Link>
            <span className="text-xs text-muted-foreground">{category.count} 篇文章</span>
          </div>
        </div>
      </article>
    </AnimatedCard>
  );
}
