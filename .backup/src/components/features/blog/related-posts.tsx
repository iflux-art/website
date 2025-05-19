import Link from 'next/link';
import { FileText } from 'lucide-react';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="py-2 px-4 font-medium text-sm border-b flex items-center gap-1.5">
        <FileText className="h-4 w-4" />
        相关文章
      </div>
      <div className="p-3">
        <div className="space-y-2">
          {posts.map(post => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-2 rounded-md hover:bg-muted text-sm hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          ))}
          {posts.length === 0 && (
            <span className="text-sm text-muted-foreground">
              暂无相关文章
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
