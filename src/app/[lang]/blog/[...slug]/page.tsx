import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { TableOfContentsClientWrapper } from '@/components/content/toc/toc-client-wrapper';
import { BackToTopButton } from '@/components/content/back-to-top-button';
import { AuthorCard } from '@/components/content/blog/author-card';
import { TagCloud } from '@/components/content/blog/tag-cloud';
import { RelatedPosts } from '@/components/content/blog/related-posts';
import { AdvertisementCard } from '@/components/content/advertisement-card';

export default function BlogPost({ params }: { params: { lang: string; slug: string[] } }) {
  // 验证语言参数
  if (params.lang !== 'zh' && params.lang !== 'en') {
    notFound();
  }

  // 构建文件路径
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const fullSlug = slug.join('/');
  let filePath;
  
  // 处理可能的子目录结构
  if (slug.length > 1) {
    const category = slug[0];
    const postName = slug.slice(1).join('/');
    filePath = path.join(process.cwd(), 'src', 'content', params.lang, 'blog', category, `${postName}.mdx`);
  } else {
    filePath = path.join(process.cwd(), 'src', 'content', params.lang, 'blog', `${fullSlug}.mdx`);
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  // 提取文章元数据
  const title = data.title || fullSlug;
  const date = data.date ? new Date(data.date).toLocaleDateString(params.lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
  const author = data.author || (params.lang === 'zh' ? '未知作者' : 'Unknown Author');
  const authorAvatar = data.authorAvatar || null;
  const authorBio = data.authorBio || (params.lang === 'zh' ? '暂无作者简介' : 'No author bio available');

  // 提取标题作为目录
  const headings: { id: string; text: string; level: number }[] = [];
  const contentLines = content.split('\n');
  contentLines.forEach((line, index) => {
    // 改进的标题匹配正则表达式，支持更多标题格式
    const headingMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s*{#([\w-]+)})?$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      // 使用自定义ID或生成一个基于文本的ID
      const customId = headingMatch[3];
      const id = customId || `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${index}`;
      
      // 只包含2-4级标题（h2-h4）
      if (level >= 2 && level <= 4) {
        headings.push({ id, text, level });
      }
    }
  });
  
  // 确保所有标题都有唯一ID
  const processedHeadings = headings.map((heading, index) => {
    // 服务端渲染环境中没有document对象，移除对document的引用
    const updatedContent = content.replace(
      new RegExp(`(^|\n)(#{${heading.level}})\\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'g'),
      `$1$2 $3 {#${heading.id}}`
    );
    return {
      ...heading,
      updatedContent
    };
  });
  
  // 应用所有内容更新
  const finalContent = processedHeadings.reduce(
    (acc, heading) => heading.updatedContent || acc, 
    content
  );

  // 获取相关文章
  const blogDir = path.join(process.cwd(), 'src', 'content', params.lang, 'blog');
  const relatedPosts: { slug: string; title: string; excerpt: string }[] = [];
  
  // 递归函数来查找所有博客文件
  const findBlogFiles = (dir: string, basePath: string = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        findBlogFiles(itemPath, relativePath);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        // 跳过当前文章
        if (itemPath === filePath) continue;
        
        const postContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(postContent);
        const postSlug = item.name.replace('.mdx', '');
        const fullPostSlug = relativePath.replace('.mdx', '');
        
        relatedPosts.push({
          slug: fullPostSlug,
          title: data.title || postSlug,
          excerpt: data.excerpt || (params.lang === 'zh' ? '点击阅读全文' : 'Click to read more')
        });
        
        // 只获取最多3篇相关文章
        if (relatedPosts.length >= 3) break;
      }
    }
  };
  
  if (fs.existsSync(blogDir)) {
    findBlogFiles(blogDir);
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* 面包屑导航 */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href={`/${params.lang}/blog`} className="hover:text-primary">
          {params.lang === 'zh' ? '博客' : 'Blog'}
        </Link>
        {slug.length > 1 && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/${params.lang}/blog/${slug[0]}`} className="hover:text-primary">
              {slug[0]}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span>{title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 主内容区 */}
        <div className="lg:flex-1 min-w-0 order-1">
          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              {date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time>{date}</time>
                </div>
              )}
            </header>
            
            <div className="prose dark:prose-invert max-w-none">
              <MDXRemote source={content} />
            </div>
          </article>

          <AuthorCard
            author={author}
            authorAvatar={authorAvatar}
            authorBio={authorBio}
            lang={params.lang}
          />
        </div>

        {/* 右侧边栏 - 目录、标签云和相关文章 */}
        <div className="lg:w-64 shrink-0 order-2">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] space-y-6">
            {/* 目录 */}
            <div>
              <TableOfContentsClientWrapper 
                headings={headings}
                lang={params.lang}
              />
            </div>
            
            <TagCloud
              tags={data.tags || []}
              lang={params.lang}
            />
            
            <RelatedPosts
              posts={relatedPosts}
              lang={params.lang}
            />
            
            <AdvertisementCard
              lang={params.lang}
            />
            
            {/* 回到顶部按钮 */}
            <div className="flex justify-left">
              <BackToTopButton 
                title={params.lang === 'zh' ? '回到顶部' : 'Back to top'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}