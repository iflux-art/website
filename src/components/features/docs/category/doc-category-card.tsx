"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DocCategory } from '@/types/docs';

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
}

/**
 * 文档分类卡片组件
 *
 * 用于显示文档分类，包括标题、描述和文档数量
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
 * />
 * ```
 */
export function DocCategoryCard({ category }: DocCategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className="transition-transform duration-200"
      style={{
        transform: `scale(${isHovered ? 1.02 : isPressed ? 0.98 : 1})`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <Card key={category.id} className="overflow-hidden h-full">
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
    </div>
  );
}
