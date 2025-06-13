
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocCategories } from '@/hooks/use-docs';

export default function DocCategories() {
  const pathname = usePathname();
  const { categories = [], loading, error } = useDocCategories();

  // 开发环境调试信息
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      console.log('文档页面路径:', pathname);
      console.log('文档分类加载状态:', loading);
      console.log('文档分类数量:', categories?.length);
      if (error) {
        console.error('文档分类加载错误:', error);
      }
    }, [pathname, loading, categories?.length, error]);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-destructive">加载失败，请稍后重试</div>
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">暂无文档分类</div>
      </div>
    );
  }

  return (
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
  );
}
