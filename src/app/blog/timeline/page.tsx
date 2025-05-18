import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export default function TimelinePage() {
  // 获取博客文章并按年份分组
  const postsByYear = getPostsByYear();

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
      
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Clock className="h-6 w-6" />
        时间轴
      </h1>
      
      <div className="relative border-l-2 border-muted pl-8 ml-4 mt-10">
        {Object.keys(postsByYear).length > 0 ? (
          Object.keys(postsByYear)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map(year => (
              <div key={year} className="mb-12">
                <div className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {year.slice(2)}
                </div>
                <h2 className="text-2xl font-bold mb-6">{year}</h2>
                <div className="space-y-8">
                  {postsByYear[year].map(post => (
                    <div key={post.slug} className="relative">
                      <div className="absolute -left-10 top-1 w-2 h-2 rounded-full bg-primary"></div>
                      <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <h3 className="text-xl font-semibold">{post.title}</h3>
                          <time className="text-sm text-muted-foreground">
                            {new Date(post.date).toLocaleDateString('zh-CN')}
                          </time>
                        </div>
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
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-10">
            <p>暂无博客文章</p>
          </div>
        )}
      </div>
    </main>
  );
}

// 获取所有博客文章并按年份分组
function getPostsByYear() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  if (!fs.existsSync(blogDir)) return {};
  
  const postsByYear: Record<string, Array<{
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
  }>> = {};
  
  // 递归函数来查找所有博客文件
  const findPostsInDirectory = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findPostsInDirectory(itemPath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        
        // 确保文章有日期且已发布
        if (data.date && data.published !== false) {
          const date = new Date(data.date);
          const year = date.getFullYear().toString();
          
          // 创建年份分组（如果不存在）
          if (!postsByYear[year]) {
            postsByYear[year] = [];
          }
          
          // 添加文章到对应年份
          const slug = path.basename(itemPath).replace(/\.(mdx|md)$/, '');
          postsByYear[year].push({
            slug,
            title: data.title || slug,
            date: data.date,
            excerpt: data.excerpt || '',
            tags: data.tags || []
          });
        }
      }
    }
  };
  
  findPostsInDirectory(blogDir);
  
  // 对每个年份内的文章按日期排序（从新到旧）
  Object.keys(postsByYear).forEach(year => {
    postsByYear[year].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });
  
  return postsByYear;
}