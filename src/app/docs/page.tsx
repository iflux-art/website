'use client';

import { useDocCategories } from '@/hooks/use-docs';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { UnifiedCard } from '@/components/common/unified-card';

export default function DocsPage() {
  const { data: categories = [] } = useDocCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">文档中心</h1>
            <p className="text-muted-foreground">探索我们的技术文档和指南</p>
          </div>

          <UnifiedGrid columns={4}>
            {categories?.map((category) => (
              <UnifiedCard
                key={category.id}
                title={category.title}
                description={category.description}
                href={`/docs/${category.id}`}
                className="h-full"
              >
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">{category.count} 篇文档</span>
                  <span className="text-sm text-primary font-medium">浏览文档 →</span>
                </div>
              </UnifiedCard>
            ))}
          </UnifiedGrid>
        </div>
      </div>
    </div>
  );
}
