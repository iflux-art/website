'use client';

import Link from 'next/link';

/**
 * 分类项接口
 */
export interface Category {
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
   * 分类中的项目数量
   */
  count: number;

  /**
   * 分类链接前缀，默认为 '/docs/'
   */
  linkPrefix?: string;
}

/**
 * 分类卡片组件属性
 */
export interface CategoryCardProps {
  /**
   * 分类信息
   */
  category: Category;

  /**
   * 索引，用于动画延迟
   */
  index?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义链接文本，默认为"浏览文档 →"
   */
  linkText?: string;
}

/**
 * 分类卡片组件
 *
 * 用于显示分类信息，包括标题、描述和项目数量
 *
 * @example
 * ```tsx
 * <CategoryCard
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
export function CategoryCard({
  category,
  index = 0,
  className = '',
  linkText = '浏览文档 →',
}: CategoryCardProps) {
  const linkPrefix = category.linkPrefix || '/docs/';

  return (
    <article
      className={`border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full max-h-[500px] ${className}`}
    >
      <div className="p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{category.title}</h2>
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{category.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <Link href={`${linkPrefix}${category.id}`} className="text-primary hover:underline">
            {linkText}
          </Link>
          <span className="text-xs text-muted-foreground">{category.count} 篇文章</span>
        </div>
      </div>
    </article>
  );
}

/**
 * @deprecated 请使用 CategoryCard 替代 DocCategoryCard，DocCategoryCard 将在未来版本中移除
 */
export { CategoryCard as DocCategoryCard };
