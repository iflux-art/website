"use client";

import { useDocCategories } from "@/hooks";
import { AppGrid } from "@/components/layout/app-grid";
import { DocCard } from "@/components/common/card/doc-card";
import type { DocCategory } from "@/types/docs-types";

export default function DocsPage() {
  const { data: categories = [] } = useDocCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">文档中心</h1>
            <p className="text-muted-foreground">探索我们的技术文档和指南</p>
          </div>

          <AppGrid columns={4}>
            {categories?.map((category: DocCategory) => (
              <DocCard
                key={category.id}
                title={category.title}
                description={category.description}
                href={`/docs/${category.id}`}
                className="h-full"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.count} 篇文档
                  </span>
                  <span className="text-sm font-medium text-primary">
                    浏览文档 →
                  </span>
                </div>
              </DocCard>
            ))}
          </AppGrid>
        </div>
      </div>
    </div>
  );
}
