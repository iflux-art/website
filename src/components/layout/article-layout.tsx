import { Suspense } from 'react';
import { Breadcrumb } from '@/components/features/breadcrumb';
import { AdaptiveSidebar } from '@/components/features/sidebar/adaptive-sidebar';

interface ArticleLayoutProps {
  children: React.ReactNode;
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
}

export function ArticleLayout({ children, headings, breadcrumbItems }: ArticleLayoutProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-1 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 面包屑导航 */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* 主要内容 */}
            {children}
          </div>
        </div>

        {/* 右侧边栏 - 目录 */}
        <div className="lg:w-64 shrink-0 order-2">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
            <Suspense fallback={<div className="h-[300px] bg-muted rounded-xl shadow-sm"></div>}>
              <AdaptiveSidebar headings={headings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
