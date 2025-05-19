import Link from 'next/link';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date?: string;
  tags: string[];
}

export function BlogList() {
  // 获取博客文章列表
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  
  // 检查目录是否存在
  if (!fs.existsSync(blogDir)) {
    return (
      <div className="col-span-full text-center py-10">
        <p>暂无博客文章</p>
      </div>
    );
  }

  // 读取目录内容
  const files = fs.readdirSync(blogDir, { withFileTypes: true });
  const blogPosts: BlogPost[] = [];

  // 处理文件和子目录
  files.forEach(file => {
    if (file.isFile() && (file.name.endsWith('.mdx') || file.name.endsWith('.md'))) {
      const filePath = path.join(blogDir, file.name);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const slug = file.name.replace(/\.(mdx|md)$/, '');
      
      // 确保文章已发布
      if (data.published !== false) {
        blogPosts.push({ 
          slug, 
          title: data.title || slug,
          excerpt: data.excerpt || '点击阅读全文',
          date: data.date,
          tags: data.tags || []
        });
      }
    } else if (file.isDirectory()) {
      const subDir = path.join(blogDir, file.name);
      const subFiles = fs.readdirSync(subDir, { withFileTypes: true });
      
      subFiles.forEach(subFile => {
        if (subFile.isFile() && (subFile.name.endsWith('.mdx') || subFile.name.endsWith('.md'))) {
          const filePath = path.join(subDir, subFile.name);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContent);
          const slug = `${file.name}/${subFile.name.replace(/\.(mdx|md)$/, '')}`;
          
          // 确保文章已发布
          if (data.published !== false) {
            blogPosts.push({ 
              slug, 
              title: data.title || slug,
              excerpt: data.excerpt || '点击阅读全文',
              date: data.date,
              tags: data.tags || []
            });
          }
        }
      });
    }
  });

  // 按日期排序（如果有日期）
  const sortedPosts = blogPosts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  if (sortedPosts.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p>暂无博客文章</p>
      </div>
    );
  }

  return (
    <>
      {sortedPosts.map(post => (
        <article key={post.slug} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            {post.date && (
              <p className="text-sm text-muted-foreground mb-2">{new Date(post.date).toLocaleDateString('zh-CN')}</p>
            )}
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/blog/tags/${encodeURIComponent(tag)}`}
                    className="px-1.5 py-0.5 bg-muted rounded text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
              阅读全文 →
            </Link>
          </div>
        </article>
      ))}
    </>
  );
}