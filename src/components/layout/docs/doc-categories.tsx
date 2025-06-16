'use client';

import Link from 'next/link';
import { useDocCategories } from '@/hooks/use-docs';
import { UnifiedGrid } from '@/components/layout/unified-grid';

export default function DocCategories() {
  const { categories = [] } = useDocCategories();

  return (
    <UnifiedGrid columns={4}>
      {categories?.map((category) => (
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
    </UnifiedGrid>
  );
}
