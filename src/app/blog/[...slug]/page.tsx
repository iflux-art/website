import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';
import { BlogContent } from '@/components/features/blog/blog-content';
import { PageTableOfContents } from '@/components/layout/toc/page-table-of-contents';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { countWords } from '@/lib/utils';

export default async function BlogPost({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const fullSlug = slug.join('/');
  // 构建文件路径
  const blogRoot = path.join(process.cwd(), 'src', 'content', 'blog');
  const possiblePaths = [
    path.join(blogRoot, `${fullSlug}.mdx`),
    path.join(blogRoot, `${fullSlug}.md`),
  ];

  // 查找存在的文件
  const filePath = possiblePaths.find(p => fs.existsSync(p));
  if (!filePath) {
    notFound();
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
  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const customId = match[3];
    const id =
      customId ||
      `heading-${text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}-${match.index}`;

    if (level >= 1 && level <= 4) {
      headings.push({ id, text, level });
    }
  }

  // 确保所有标题都有唯一ID
  let processedContent = content;
  headings.forEach(heading => {
    const headingRegex = new RegExp(
      `^(#{${heading.level})\\s+(${heading.text.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )})(?:\\s*{#[\\w-]+})?$`,
      'gm'
    );
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });
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

              <BlogContent
                title={title}
                date={date}
                tags={data.tags || []}
                wordCount={wordCount}
                mdxContent={<MarkdownRenderer content={processedContent} />}
                _path={`/blog/${fullSlug}`}
              />
            </div>
          </main>

          {/* 右侧目录 */}
          <PageTableOfContents headings={headings} />
        </div>
      </div>
    </div>
  );
}