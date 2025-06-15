// page.tsx
import DocCategories from '@/components/features/docs/doc-categories';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">文档中心</h1>
            <p className="text-muted-foreground">探索我们的技术文档和指南</p>
          </div>

          <DocCategories />
        </div>
      </div>
    </div>
  );
}