import Link from 'next/link';
import { Tag, Clock } from 'lucide-react';

import { BlogList } from '@/components/features/blog/blog-list';
import { getAllTags } from '@/lib/blog';

export default function BlogPage() {
  // 获取所有标签
  const allTags = getAllTags();

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">博客</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <Link 
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          <Tag className="h-4 w-4" />
          全部文章
        </Link>
        <Link 
          href="/blog/timeline"
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <Clock className="h-4 w-4" />
          时间轴
        </Link>
      </div>
      
      {/* 标签过滤器 */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            按标签浏览
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <Link 
                key={index} 
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogList />
      </div>
    </main>
  );
}

// 使用lib/blog中的getAllTags函数

// 使用components/blog/blog-list中的BlogList组件