import Link from 'next/link';
import { Tag, Clock } from 'lucide-react';
import { BlogTimelineList } from '@/components/features/blog/blog-timeline-list';

export default async function TimelinePage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">博客</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <Tag className="h-4 w-4" />
          全部文章
        </Link>
        <Link
          href="/blog/timeline"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          <Clock className="h-4 w-4" />
          时间轴
        </Link>
      </div>

      <div className="mt-8 pb-10 max-w-2xl mx-auto">
        <BlogTimelineList />
      </div>
    </main>
  );
}