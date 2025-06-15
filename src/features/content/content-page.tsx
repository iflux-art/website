import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Breadcrumb, type BreadcrumbItem } from '@/components/layout/breadcrumb';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { PageTableOfContents } from '@/components/layout/toc/page-table-of-contents';

interface Frontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  author?: string;
  [key: string]: unknown;
}
interface ContentPageProps {
  /**
   * 文件相对路径
   */
  slug: string[];
  /**
   * 内容根目录（相对于 process.cwd()/src/content/）
   */
  contentRoot: string;
  /**
   * 面包屑基础路径
   */
  breadcrumbBase: {
    label: string;
    href: string;
  };
  /**
   * 自定义左侧边栏
   */
  sidebar?: React.ReactNode;
  /**
   * 渲染内容
   */
  renderContent: (props: {
    title: string;
    content: React.ReactNode;
    metadata: Frontmatter;
  }) => React.ReactNode;
}

export function getContentData(contentRoot: string, slug: string[]) {
  const fullSlug = slug.join('/');
  const rootPath = path.join(process.cwd(), 'src', 'content', contentRoot);
  const possiblePaths = [
    path.join(rootPath, `${fullSlug}.mdx`),
    path.join(rootPath, `${fullSlug}.md`),
  ];

  // 查找存在的文件
  const filePath = possiblePaths.find(p => fs.existsSync(p));
  if (!filePath) {
    return null;
  }

  // 读取并解析文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

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
      `^(#{${heading.level}})\\s+(${heading.text.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )})(?:\\s*{#[\\w-]+})?$`,
      'gm'
    );
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  return {
    content: processedContent,
    metadata: data,
    headings,
  };
}

export default async function ContentPage({
  slug,
  contentRoot,
  breadcrumbBase,
  sidebar,
  renderContent,
}: ContentPageProps) {
  const data = getContentData(contentRoot, slug);
  if (!data) return null;

  const { content, metadata, headings } = data;
  const title = metadata.title || slug[slug.length - 1];

  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [
    breadcrumbBase,
    ...(slug.length > 1
      ? [
          {
            label: slug[0],
            href: `${breadcrumbBase.href}/${slug[0]}`,
          },
        ]
      : []),
    { label: title },
  ];

  const mdxContent = await (<MDXRenderer content={content} />);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* 左侧边栏 */}
          <aside className="hidden lg:block w-64 shrink-0 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto">
            {sidebar}
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {/* 面包屑导航 */}
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              {renderContent({
                title,
                content: mdxContent,
                metadata: {
                  ...metadata,
                  title: title,
                },
              })}
            </div>
          </main>

          {/* 右侧目录 */}
          <PageTableOfContents headings={headings} />
        </div>
      </div>
    </div>
  );
}
