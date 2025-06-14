// page.tsx
import { Suspense } from 'react';
import DocCategories from '../../components/features/docs/doc-categories';
import { PageHeader } from '@/components/ui/page-header';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          <PageHeader 
            heading="文档中心"
            text="探索我们的技术文档和指南"
          />

          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          }>
            <DocCategories />
          </Suspense>
        </div>
      </div>
    </div>
  );
}