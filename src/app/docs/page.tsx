'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useDocCategories } from '@/hooks/use-docs';

export default function DocsPage() {
  const pathname = usePathname();

  // 使用客户端钩子获取文档分类
  const { categories, loading, error } = useDocCategories();

  // 仅在开发环境下添加调试信息
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      console.log('文档页面路径:', pathname);
      console.log('文档分类加载状态:', loading);
      console.log('文档分类数量:', categories.length);
      if (error) {
        console.error('文档分类加载错误:', error);
      }
    }, [pathname, loading, categories.length, error]);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">文档中心</h1>
            <p className="text-muted-foreground">探索我们的技术文档和指南</p>
          </div>

          {/* 文档分类网格 */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link key={category.id} href={`/docs/${category.id}`} className="block">
                <article className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card h-full">
                  <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight mb-3 line-clamp-1 hover:text-primary transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{category.count} 篇文档</span>
                      <span className="text-sm text-primary font-medium">浏览文档 →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="flex justify-center items-center py-12">
              <div className="text-destructive">加载失败，请稍后重试</div>
            </div>
          )}

          {/* 空状态 */}
          {!loading && !error && categories.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">暂无文档分类</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
