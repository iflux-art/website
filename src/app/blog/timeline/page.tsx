import { BlogTimelineList } from '@/components/features/blog/blog-timeline-list';
import { BlogNav } from '@/components/features/blog/blog-nav';

export default async function TimelinePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          {/* 页面标题 */}
          <h1 className="text-3xl font-bold mb-6">博客</h1>

          {/* 导航按钮 */}
          <BlogNav active="timeline" />

          {/* 时间轴内容 */}
          <div className="max-w-2xl mx-auto">
            <BlogTimelineList />
          </div>
        </div>
      </div>
    </div>
  );
}