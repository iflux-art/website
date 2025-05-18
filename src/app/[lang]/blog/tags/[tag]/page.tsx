import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Tag } from 'lucide-react';

export default function TagPage({ params }: { params: { lang: string; tag: string } }) {
  // 验证语言参数
  if (params.lang !== 'zh' && params.lang !== 'en') {
    notFound();
  }

  const tag = decodeURIComponent(params.tag);
  const blogPosts = getBlogPostsByTag(params.lang, tag);

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link 
          href={`/${params.lang}/blog`}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {params.lang === 'zh' ? '← 返回博客列表' : '← Back to blog'}
        </Link>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <Tag className="h-5 w-5" />
        <h1 className="text-3xl font-bold">
          {params.lang === 'zh' ? `标签: ${tag}` : `Tag: ${tag}`}
        </h1>
      </div>
      
      {blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((postTag: string) => (
                    <Link 
                      key={postTag} 
                      href={`/${params.lang}/blog/tags/${postTag}`}
                      className={cn(
                        "px-2 py-1 rounded-md text-xs transition-colors",
                        postTag === tag 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-primary/10"
                      )}
                    >
                      {postTag}
                    </Link>
                  ))}
                </div>
                <Link href={`/${params.lang}/blog/${post.slug}`} className="text-primary hover:underline">
                  {params.lang === 'zh' ? '阅读全文 →' : 'Read more →'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p>{params.lang === 'zh' ? `没有找到标签为 "${tag}" 的文章` : `No posts found with tag "${tag}"`}</p>
        </div>
      )}
    </main>
  );
}

function getBlogPostsByTag(lang: string, tag: string) {
  const blogDir = path.join(process.cwd(), 'src', 'content', lang, 'blog');
  const posts: any[] = [];

  // 递归函数来查找所有博客文件
  const findBlogFiles = (dir: string, basePath: string = '') => {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        findBlogFiles(itemPath, relativePath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        const postContent = fs.readFileSync(itemPath, 'utf8');
        const { data, content } = matter(postContent);
        const postSlug = relativePath.replace('.mdx', '');
        
        // 检查文章是否包含指定标签
        const postTags = data.tags || [];
        if (postTags.includes(tag)) {
          posts.push({
            slug: postSlug,
            title: data.title || postSlug,
            excerpt: data.excerpt || (lang === 'zh' ? '点击阅读全文' : 'Click to read more'),
            date: data.date,
            tags: postTags
          });
        }
      }
    }
  };
  
  if (fs.existsSync(blogDir)) {
    findBlogFiles(blogDir);
  }

  // 按日期排序（如果有日期）
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}