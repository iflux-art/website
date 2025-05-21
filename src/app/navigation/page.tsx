'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigationData } from '@/hooks/use-navigation-data';
import { Category } from '@/types/navigation';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { CategoryColorCard } from '@/components/ui/navigation/category-color';

export default function NavigationPage() {
  // 使用统一的数据加载hook
  const { categories, featuredResources, recentResources, loading, error } = useNavigationData();

  // 加载状态显示
  if (loading) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">网站导航</h1>

        {/* 加载状态 */}
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">精选资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">最新添加</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">网站导航</h1>

      {/* 分类导航 */}
      {(() => {
        // 预先创建分类网格
        const categoriesGrid = (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">暂无分类数据</p>
            )}
          </div>
        );

        return (
          <AnimatedContainer
            baseDelay={0.05}
            staggerDelay={0.05}
            variant="fade"
            autoWrap={false}
            className="mb-12"
            threshold={0.1}
            rootMargin="0px"
          >
            {categoriesGrid}
          </AnimatedContainer>
        );
      })()}

      {/* 精选资源 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">精选资源</h2>
        {(() => {
          // 预先创建资源网格
          const resourcesGrid = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources && featuredResources.length > 0 ? (
                featuredResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))
              ) : (
                <p className="col-span-3 text-center text-muted-foreground">暂无精选资源</p>
              )}
            </div>
          );

          return (
            <AnimatedContainer
              baseDelay={0.05}
              staggerDelay={0.05}
              variant="fade"
              autoWrap={false}
              threshold={0.1}
              rootMargin="0px"
            >
              {resourcesGrid}
            </AnimatedContainer>
          );
        })()}
      </section>

      {/* 最新添加 */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">最新添加</h2>
        {(() => {
          // 预先创建最新资源网格
          const recentResourcesGrid = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentResources && recentResources.length > 0 ? (
                recentResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))
              ) : (
                <p className="col-span-3 text-center text-muted-foreground">暂无最新资源</p>
              )}
            </div>
          );

          return (
            <AnimatedContainer
              baseDelay={0.05}
              staggerDelay={0.05}
              variant="fade"
              autoWrap={false}
              threshold={0.1}
              rootMargin="0px"
            >
              {recentResourcesGrid}
            </AnimatedContainer>
          );
        })()}
      </section>
    </main>
  );
}

/**
 * 分类卡片组件属性
 *
 * @interface CategoryCardProps
 */
interface CategoryCardProps {
  /**
   * 分类数据
   */
  category: Category;

  /**
   * 索引，用于动画延迟
   */
  index?: number;
}

/**
 * 分类卡片组件
 *
 * 用于显示导航页面中的分类卡片，包括图标、标题和描述
 * 使用 AnimatedCard 组件实现动画效果
 *
 * @param {CategoryCardProps} props - 组件属性
 * @returns {JSX.Element} 分类卡片组件
 */
function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <AnimatedCard delay={index * 0.05} duration={0.5} variant="fade" className="h-full">
      <Link href={`/navigation/${category.id}`}>
        <CategoryColorCard color={category.color} className="h-full overflow-hidden">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </CardContent>
          <CardFooter className="p-4 flex justify-end bg-background/50">
            <div className="flex items-center text-sm font-medium">
              浏览
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </CategoryColorCard>
      </Link>
    </AnimatedCard>
  );
}

// 导入资源卡片组件
import { ResourceCard } from '@/components/features/navigation';
