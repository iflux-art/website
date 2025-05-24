import Link from 'next/link';
import { Tag, Clock } from 'lucide-react';
import { BlogTimelineList } from '@/components/features/blog/blog-timeline-list';
import { BlogLayout } from '@/components/layouts';

export default async function TimelinePage() {
  return (
    <BlogLayout
      title="博客"
      extraContent={
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/blog"
            className="flex items-center gap-2 px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Tag className="h-4 w-4" />
            全部文章
          </Link>
          <Link
            href="/blog/timeline"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Clock className="h-4 w-4" />
            时间轴
          </Link>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <BlogTimelineList />
      </div>
    </BlogLayout>
  );
}
