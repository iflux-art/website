import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Suspense } from 'react';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { MarkdownContent as MDXContent } from '@/components/ui/markdown-content';
import { AdaptiveSidebar } from '@/components/ui/adaptive-sidebar';
import { DocSidebar } from '@/components/features/docs/sidebar/doc-sidebar';
import { SidebarErrorWrapper } from '@/components/ui/sidebar-error-wrapper';
import { MdxContentWrapper } from '@/components/ui/mdx-content-wrapper';
import { MdxServerRenderer } from '@/components/ui/mdx-server-renderer';

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

  // 处理内容中的代码块
  let processedContent = mdxContent;

  // 读取根目录的 _meta.json 文件
  const rootMetaPath = path.join(process.cwd(), 'src', 'content', 'navigation', '_meta.json');
  let rootMeta = {};

  if (fs.existsSync(rootMetaPath)) {
    try {
      rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, 'utf8'));
    } catch (error) {
      console.error('解析根目录 _meta.json 文件失败:', error);
    }
  }

  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [{ label: '网址导航', href: '/navigation' }];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 左侧边栏 - 导航列表 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
            <Suspense fallback={<div className="h-[500px] bg-muted rounded-xl shadow-sm"></div>}>
              <div className="no-animation">
                <SidebarErrorWrapper>
                  <DocSidebar category="navigation" currentDoc="development" />
                </SidebarErrorWrapper>
              </div>
            </Suspense>
          </div>
        </div>

        {/* 中间内容区 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-2 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 面包屑导航 */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <h1 className="text-4xl font-bold mb-8 tracking-tight">{title}</h1>
            <MDXContent>
              <MdxContentWrapper html={await MdxServerRenderer({ content: mdxContent })} />
            </MDXContent>
          </div>
        </div>

        {/* 右侧边栏 - 目录 */}
        <div className="lg:w-64 shrink-0 order-3">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
            <Suspense fallback={<div className="h-[300px] bg-muted rounded-xl shadow-sm"></div>}>
              {/* 使用自适应侧边栏组件显示文档目录 */}
              <AdaptiveSidebar headings={headings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
