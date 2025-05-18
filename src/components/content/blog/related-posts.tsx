import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  lang: string;
}

export function RelatedPosts({ posts, lang }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h3 className="font-medium mb-3">
        {lang === 'zh' ? '相关文章' : 'Related Articles'}
      </h3>
      <div className="space-y-3">
        {posts.map(post => (
          <Card key={post.slug} className="overflow-hidden">
            <CardContent className="p-3">
              <Link 
                href={`/${lang}/blog/${post.slug}`}
                className="text-sm font-medium hover:text-primary line-clamp-2"
              >
                {post.title}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}