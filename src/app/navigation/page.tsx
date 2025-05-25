import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Suspense } from 'react';

import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Sidebar } from '@/components/ui/sidebar';
import { TocContainer } from '@/components/ui/toc-container';
import { MarkdownContent as MDXContent } from '@/components/mdx/markdown-content';
import { MdxContentWrapper } from '@/components/mdx/mdx-content-wrapper';
import { MdxServerRenderer } from '@/components/mdx/mdx-server-renderer';
import { StickyLayout } from '@/components/layout/sticky-layout';

export default async function NavigationPage() {
  // 默认显示 development 页面内容
  const slug = ['development'];
  const fullSlug = slug.join('/');

  // 直接读取 MDX 文件
  let filePath = '';
  const mdxPath = path.join(process.cwd(), 'src', 'content', 'navigation', `${fullSlug}.mdx`);
  const mdPath = path.join(process.cwd(), 'src', 'content', 'navigation', `${fullSlug}.md`);

  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    console.error(`找不到导航页面: ${fullSlug}`);
    notFound();
  }

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content: mdxContent } = matter(fileContent);

  console.log(`成功读取导航页面: ${fullSlug}`, {
    contentLength: mdxContent.length,
    frontmatterKeys: Object.keys(frontmatter),
  });

  // 获取标题
  const title = frontmatter.title || '网址导航';

  // 提取标题作为目录
  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;

  while ((match = headingRegex.exec(mdxContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const customId = match[3];
    const id =
      customId ||
      `heading-${text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}-${match.index}`;

    // 只包含1-4级标题（h1-h4）
    if (level >= 1 && level <= 4) {
      headings.push({ id, text, level });
    }
  }

  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [{ label: '网址导航', href: '/navigation' }];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* 左侧边栏 */}
          <aside className="hidden lg:block w-64 shrink-0">
            <StickyLayout>
              <Suspense fallback={<div className="h-[500px] bg-muted rounded-xl shadow-sm"></div>}>
                <Sidebar category="navigation" currentDoc="development" isNavigation={true} />
              </Suspense>
            </StickyLayout>
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {/* 面包屑导航 */}
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              {/* 文章内容 */}
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold mb-8 tracking-tight">{title}</h1>
                <MDXContent>
                  <MdxContentWrapper html={await MdxServerRenderer({ content: mdxContent })} />
                </MDXContent>
              </article>
            </div>
          </main>

          {/* 右侧目录 */}
          <aside className="hidden xl:block w-64 shrink-0">
            <StickyLayout>
              <Suspense fallback={<div className="h-[300px] bg-muted rounded-xl shadow-sm"></div>}>
                <TocContainer headings={headings} />
              </Suspense>
            </StickyLayout>
          </aside>
        </div>
      </div>
    </div>
  );
}
