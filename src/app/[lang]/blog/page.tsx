import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Tag } from 'lucide-react';

export default function BlogPage({ params }: { params: { lang: string } }) {
  // 验证语言参数
  if (params.lang !== 'zh' && params.lang !== 'en') {
    notFound();
  }

  // 获取所有标签
  const allTags = getAllTags(params.lang);

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{params.lang === 'zh' ? '博客' : 'Blog'}</h1>
      
      {/* 标签过滤器 */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            {params.lang === 'zh' ? '按标签浏览' : 'Browse by tag'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <Link 
                key={index} 
                href={`/${params.lang}/blog/tags/${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogList lang={params.lang} />
      </div>
    </main>
  );
}

// 获取所有标签
function getAllTags(lang: string): string[] {
  const blogDir = path.join(process.cwd(), 'src', 'content', lang, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  
  const allTags = new Set<string>();
  
  // 递归函数来查找所有博客文件和标签
  const findTagsInFiles = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findTagsInFiles(itemPath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        const fileContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(fileContent);
        
        // 收集标签
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => allTags.add(tag));
        }
      }
    }
  };
  
  findTagsInFiles(blogDir);
  return Array.from(allTags).sort();
}

function BlogList({ lang }: { lang: string }) {
  // 获取博客文章列表
  const blogDir = path.join(process.cwd(), 'src', 'content', lang, 'blog');
  
  // 检查目录是否存在
  if (!fs.existsSync(blogDir)) {
    return (
      <div className="col-span-full text-center py-10">
        <p>{lang === 'zh' ? '暂无博客文章' : 'No blog posts available'}</p>
      </div>
    );
  }

  // 读取目录内容
  const files = fs.readdirSync(blogDir, { withFileTypes: true });
  const blogPosts: { slug: string; title: string; excerpt: string; tags: string[] }[] = [];

  // 处理文件和子目录
  files.forEach(file => {
    if (file.isFile() && file.name.endsWith('.mdx')) {
      const filePath = path.join(blogDir, file.name);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const slug = file.name.replace('.mdx', '');
      
      blogPosts.push({ 
        slug, 
        title: data.title || slug,
        excerpt: data.excerpt || (lang === 'zh' ? '点击阅读全文' : 'Click to read more'),
        tags: data.tags || []
      });
    } else if (file.isDirectory()) {
      const subDir = path.join(blogDir, file.name);
      const subFiles = fs.readdirSync(subDir, { withFileTypes: true });
      
      subFiles.forEach(subFile => {
        if (subFile.isFile() && subFile.name.endsWith('.mdx')) {
          const filePath = path.join(subDir, subFile.name);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContent);
          const slug = `${file.name}/${subFile.name.replace('.mdx', '')}`;
          
          blogPosts.push({ 
            slug, 
            title: data.title || slug,
            excerpt: data.excerpt || (lang === 'zh' ? '点击阅读全文' : 'Click to read more'),
            tags: data.tags || []
          });
        }
      });
    }
  });

  if (blogPosts.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p>{lang === 'zh' ? '暂无博客文章' : 'No blog posts available'}</p>
      </div>
    );
  }

  return (
    <>
      {blogPosts.map(post => (
        <article key={post.slug} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/${lang}/blog/tags/${encodeURIComponent(tag)}`}
                    className="px-1.5 py-0.5 bg-muted rounded text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <Link href={`/${lang}/blog/${post.slug}`} className="text-primary hover:underline">
              {lang === 'zh' ? '阅读全文 →' : 'Read more →'}
            </Link>
          </div>
        </article>
      ))}
    </>
  );
}