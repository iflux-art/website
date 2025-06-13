import { AdaptiveSidebar } from './adaptive-sidebar';
import type { Heading } from '@/components/features/docs/docs-types';

export interface PageTableOfContentsProps {
  /**
   * 文档标题列表
   */
  headings: Array<Heading>;
}

/**
 * 页面目录组件
 *
 * 用于博客文章和文档页面的右侧目录导航
 */
export function PageTableOfContents({ headings }: PageTableOfContentsProps) {
  return (
    <aside className="hidden xl:block w-64 shrink-0 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto">
      <AdaptiveSidebar headings={headings} />
    </aside>
  );
}
