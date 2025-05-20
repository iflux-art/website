import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { Breadcrumb, BreadcrumbItem } from '@/components/features/content/breadcrumb';
import { BlogContent } from '@/components/features/blog/blog-content';
import { BlogSidebar } from '@/components/features/blog/blog-sidebar';

export default async function BlogPost({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 使用解构赋值来避免直接访问 params.slug
  const { slug } = params;
  // 不需要额外的变量来存储 searchParams
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

  // 使用更强大的正则表达式直接从整个内容中提取标题
  // 匹配 ## 标题、### 标题、#### 标题 格式
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;

  // 调试信息
  console.log('提取标题前的内容长度:', content.length);
  console.log('内容前100个字符:', content.substring(0, 100));

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const customId = match[3];
    const id = customId || `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${match.index}`;

    // 只包含1-4级标题（h1-h4）
    if (level >= 1 && level <= 4) {
      headings.push({ id, text, level });
    }
  }

  // 调试信息
  console.log('提取到的标题数量:', headings.length);
  if (headings.length > 0) {
    console.log('第一个标题:', headings[0]);
  }

  // 确保所有标题都有唯一ID
  let processedContent = content;
  headings.forEach((heading) => {
    // 替换标题行，添加ID
    const headingRegex = new RegExp(`^(#{${heading.level})\\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})(?:\\s*{#[\\w-]+})?$`, 'gm');
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  // 对每个标题再次检查并确保它们有唯一ID
  headings.forEach((heading) => {
    // 查找没有ID的标题并添加ID
    processedContent = processedContent.replace(
      new RegExp(`(^|\n)(#{${heading.level})\\s+(${heading.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})(?!\\s*{#)`, 'g'),
      `$1$2 $3 {#${heading.id}}`
    );
  });

  // 使用处理后的内容
  const finalContent = processedContent;

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

  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "博客", href: "/blog" },
    ...(slug.length > 1 ? [{ label: slug[0], href: `/blog/${slug[0]}` }] : []),
    { label: title }
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      {/* 面包屑导航 */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 主内容区 */}
        <div className="lg:flex-1 min-w-0 order-1">
          <BlogContent
            title={title}
            date={date}
            content={finalContent}
            author={author}
            authorAvatar={authorAvatar}
            authorBio={authorBio}
          />
        </div>

        {/* 右侧边栏 - 目录、标签云和相关文章 */}
        <div className="lg:w-64 shrink-0 order-2 relative">
          <div className="sticky top-20">
            <BlogSidebar
              headings={headings}
              tags={data.tags || []}
              relatedPosts={relatedPosts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}