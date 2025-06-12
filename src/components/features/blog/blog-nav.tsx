
import Link from 'next/link';
import { Tag, Clock } from 'lucide-react';

interface BlogNavProps {
  active: 'posts' | 'timeline';
}

export function BlogNav({ active }: BlogNavProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Link
        href="/blog"
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all ${
          active === 'posts'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        <Tag className="h-4 w-4" />
        全部文章
      </Link>
      <Link
        href="/blog/timeline"
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all ${
          active === 'timeline'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        <Clock className="h-4 w-4" />
        时间轴
      </Link>
    </div>
  );
}
