import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { Breadcrumb, type BreadcrumbItem } from '@/components/common/breadcrumb';
import { ContentDisplay } from '@/components/common/content-display';
import { TableOfContents } from '@/components/layout/toc/table-of-contents';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { countWords } from '@/lib/utils';
import { extractHeadings } from '@/components/layout/toc/extract-headings';

export default async function BlogPost({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const fullSlug = slug.join('/');

  // 构建文件路径
  const blogRoot = path.join(process.cwd(), 'src', 'content', 'blog');
  const requestedPath = slug.join('/');
  const absoluteRequestedPath = path.join(blogRoot, requestedPath);
  let filePath: string | undefined;

  // 1. 检查是否是目录请求
  if (fs.existsSync(absoluteRequestedPath) && fs.statSync(absoluteRequestedPath).isDirectory()) {
    const indexMdxPath = path.join(absoluteRequestedPath, 'index.mdx');
    const indexMdPath = path.join(absoluteRequestedPath, 'index.md');

    if (fs.existsSync(indexMdxPath)) {
      filePath = indexMdxPath;
    } else if (fs.existsSync(indexMdPath)) {
      filePath = indexMdPath;
    }
  }

  // 2. 如果不是目录或目录中没有索引文件，尝试直接文件路径
  if (!filePath) {
    const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
    if (fs.existsSync(possiblePathMdx)) {
      filePath = possiblePathMdx;
    } else {
      const possiblePathMd = `${absoluteRequestedPath}.md`;
      if (fs.existsSync(possiblePathMd)) {
        filePath = possiblePathMd;
      }
    }
  }

  // 收集所有可能的文件路径用于错误报告
  const possiblePaths = {
    indexMdx: path.join(absoluteRequestedPath, 'index.mdx'),
    indexMd: path.join(absoluteRequestedPath, 'index.md'),
    directMdx: `${absoluteRequestedPath}.mdx`,
    directMd: `${absoluteRequestedPath}.md`,
  };
  if (!filePath) {
    console.error('Failed to find blog post:', {
      params: resolvedParams,
      slug,
      fullSlug,
      possiblePaths,
      cwd: process.cwd(),
      blogRoot,
    });
    throw new Error(`博客文章未找到: ${fullSlug}`);
  }
  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);
  const wordCount = countWords(content);

  // 提取文章元数据
  const title = data.title || fullSlug;
  const date = data.date
    ? new Date(data.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // 提取标题作为目录
  const { headings } = extractHeadings(content);
  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '博客', href: '/blog' },
    ...(slug.length > 1
      ? [
          {
            label: slug[0],
            href: `/blog/${slug[0]}`,
          },
        ]
      : []),
    { label: title },
  ];

  const mdxContent = await MDXRenderer({ content });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* 左侧空白区域，用于保持与文档页面布局一致 */}
          <aside className="hidden lg:block w-64 shrink-0">
            {/* 这里可以添加博客分类或其他导航 */}
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {/* 面包屑导航 */}
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <ContentDisplay
                contentType="blog"
                title={title}
                date={date}
                category={data.category}
                tags={data.tags || []}
                wordCount={wordCount}
              >
                {mdxContent}
              </ContentDisplay>
            </div>
          </main>

          {/* 右侧目录 */}
          <aside className="hidden xl:block w-64 max-w-64 box-border pr-4 shrink-0 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto [overflow-wrap:break-word] [word-break:break-all] [white-space:normal]">
            <TableOfContents headings={headings} adaptive={true} adaptiveOffset={80} />
          </aside>
        </div>
      </div>
    </div>
  );
}
