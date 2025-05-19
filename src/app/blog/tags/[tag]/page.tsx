import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export default async function TagPage({ params }: { params: { tag: string } }) {
  // 解码URL中的标签参数
  const decodedTag = decodeURIComponent(params.tag);

  // 获取所有文章
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const taggedPosts: { slug: string; title: string; excerpt: string; date?: string }[] = [];

  // 递归查找所有博客文件
  const findTaggedPosts = (dir: string, basePath: string = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        findTaggedPosts(itemPath, relativePath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        const postSlug = item.name.replace('.mdx', '');
        const fullPostSlug = relativePath.replace('.mdx', '');

        // 检查文章是否包含当前标签
        if (data.tags && data.tags.includes(decodedTag)) {
          taggedPosts.push({
            slug: fullPostSlug,
            title: data.title || postSlug,
            excerpt: data.excerpt || '点击阅读全文',
            date: data.date
          });
        }
      }
    }
  };

  if (fs.existsSync(blogDir)) {
    findTaggedPosts(blogDir);
  }

  // 按日期排序
  const sortedPosts = taggedPosts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link
          href="/blog"
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回博客列表
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">标签: {decodedTag}</h1>

      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map(post => (
            <article key={post.slug} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.date && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </p>
                )}
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:underline"
                >
                  阅读全文 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p>暂无带有此标签的文章</p>
        </div>
      )}
    </main>
  );
}