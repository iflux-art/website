'use client';

import Link from 'next/link';
import { useDocCategories } from '@/hooks/use-docs';
import { ChevronRight } from 'lucide-react';

export default function DocList() {
  const { categories = [] } = useDocCategories();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {categories?.map((category) => (
        <div key={category.id} className="border-b border-border pb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight mb-2">{category.title}</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="flex items-center justify-between group">
            <span className="text-sm text-muted-foreground">{category.count} 篇文档</span>
            <Link
              href={`/docs/${category.id}`}
              className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              浏览文档
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
