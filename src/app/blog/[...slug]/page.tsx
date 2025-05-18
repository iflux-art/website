import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { mdxComponents } from '@/mdx-components';

import { TableOfContentsClientWrapper } from '@/components/features/content/toc/toc-client-wrapper';
import { BackToTopButton } from '@/components/features/content/back-to-top-button';
import { AuthorCard } from '@/components/features/blog/author-card';
import { TagCloud } from '@/components/features/blog/tag-cloud';
import { RelatedPosts } from '@/components/features/blog/related-posts';
import { AdvertisementCard } from '@/components/features/content/advertisement-card';

import { PageProps } from '@/types/page-props';

export default async function BlogPost({ params }: PageProps) {
  const slug = params.slug;
  const fullSlug = slug.join('/');
  let filePath: string | undefined;
  
  // 处理可能的子目录结构
  if (slug.length > 1) {
    const category = slug[0];
    const postName = slug.slice(1).join('/');
    // 尝试不同的文件扩展名
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'blog', category, `${postName}.mdx`);
    const mdPath = path.join(process.cwd(), 'src', 'content', 'blog', category, `${postName}.md`);
    
    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }
  } else {
    // 尝试不同的文件扩展名
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'blog', `${fullSlug}.mdx`);
    const mdPath = path.join(process.cwd(), 'src', 'content', 'blog', `${fullSlug}.md`);
    
    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }
  }

  // 检查文件是否存在
  if (!filePath || !fs.existsSync(filePath)) {
    notFound();
  }

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  // 提取文章元数据
  const title = data.title || fullSlug;
  const date = data.date ? new Date(data.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
  const author = data.author || '未知作者';
  const authorAvatar = data.authorAvatar || null;
  const authorBio = data.authorBio || '暂无作者简介';

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
  let processedContent = content;
  headings.forEach((heading) => {
    // 替换标题行，添加ID
    const headingRegex = new RegExp(`^(#{${heading.level})\\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})(?:\\s*{#[\\w-]+})?$`, 'gm');
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });
  
  // 确保所有标题都有唯一ID
  const processedHeadings = headings.map((heading) => {
    // 服务端渲染环境中没有document对象，移除对document的引用
    const updatedContent = content.replace(
      new RegExp(`(^|\n)(#{${heading.level})\\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'g'),
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
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const relatedPosts: { slug: string; title: string; excerpt: string }[] = [];
  
  // 递归函数来查找所有博客文件
  const findBlogFiles = (dir: string, basePath: string = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        findBlogFiles(itemPath, relativePath);
      } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
        // 跳过当前文章
        if (itemPath === filePath) continue;
        
        const postContent = fs.readFileSync(itemPath, 'utf8');
        const { data } = matter(postContent);
        const postSlug = item.name.replace(/\.(mdx|md)$/, '');
        const fullPostSlug = relativePath.replace(/\.(mdx|md)$/, '');
        
        relatedPosts.push({
          slug: fullPostSlug,
          title: data.title || postSlug,
          excerpt: data.excerpt || '点击阅读全文'
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
        <Link href="/blog" className="hover:text-primary">
          博客
        </Link>
        {slug.length > 1 && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/blog/${slug[0]}`} className="hover:text-primary">
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
              <MDXRemote source={finalContent} components={mdxComponents} />
            </div>
          </article>

          <AuthorCard
            author={author}
            authorAvatar={authorAvatar}
            authorBio={authorBio}
          />
        </div>

        {/* 右侧边栏 - 目录、标签云和相关文章 */}
        <div className="lg:w-64 shrink-0 order-2">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] space-y-6">
            {/* 目录 */}
            <div>
              <TableOfContentsClientWrapper 
                headings={headings}
              />
            </div>
            
            <TagCloud
              tags={data.tags || []}
            />
            
            <RelatedPosts
              posts={relatedPosts}
            />
            
            <AdvertisementCard />
            
            {/* 回到顶部按钮 */}
            <div className="flex justify-left">
              <BackToTopButton 
                title="回到顶部"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}