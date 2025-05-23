import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Suspense } from 'react';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { MarkdownContent as MDXContent } from '@/components/ui/markdown/markdown-content';
import { AdaptiveSidebar } from '@/components/ui/adaptive-sidebar';
import { DocSidebar } from '@/components/features/docs/sidebar/doc-sidebar';
import { SidebarErrorWrapper } from '@/components/ui/sidebar-error-wrapper';
import { MdxContentWrapper } from '@/components/ui/markdown/mdx-content-wrapper';
import { MdxServerRenderer } from '@/components/ui/markdown/mdx-server-renderer';

export default async function NavigationPage({ params }: { params: { slug: string[] } }) {
  // 使用 await 来确保 params 是可用的
  let slug = await Promise.resolve(params.slug);

  if (!slug || slug.length === 0) {
    // 获取导航目录中的第一个 MDX 文件
    const navigationDir = path.join(process.cwd(), 'src', 'content', 'navigation');

    try {
      // 读取目录内容
      const items = fs.readdirSync(navigationDir);

      // 过滤出 MDX 文件和目录
      const validItems = items.filter(item => {
        // 排除 _meta.json 文件和以 _ 开头的文件/目录
        if (item === '_meta.json' || item.startsWith('_')) {
          return false;
        }

        const itemPath = path.join(navigationDir, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();

        // 如果是目录，检查是否有 index.mdx 或 index.md
        if (isDirectory) {
          const indexMdx = path.join(itemPath, 'index.mdx');
          const indexMd = path.join(itemPath, 'index.md');
          return fs.existsSync(indexMdx) || fs.existsSync(indexMd);
        }

        // 如果是文件，检查是否是 MDX 或 MD 文件
        return item.endsWith('.mdx') || item.endsWith('.md');
      });

      if (validItems.length > 0) {
        // 获取第一个有效项
        const firstItem = validItems[0];

        // 使用第一个有效项作为 slug
        slug = [firstItem.replace(/\.(mdx|md)$/, '')];
      } else {
        notFound();
      }
    } catch (error) {
      console.error('获取导航目录失败:', error);
      notFound();
    }
  }

  const fullSlug = slug.join('/');
  let filePath: string | undefined;

  // 处理可能的子目录结构
  if (slug.length > 1) {
    const category = slug[0];
    const pageName = slug.slice(1).join('/');
    // 尝试不同的文件扩展名
    const mdxPath = path.join(
      process.cwd(),
      'src',
      'content',
      'navigation',
      category,
      `${pageName}.mdx`
    );
    const mdPath = path.join(
      process.cwd(),
      'src',
      'content',
      'navigation',
      category,
      `${pageName}.md`
    );

    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }
  } else {
    // 尝试不同的文件扩展名
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'navigation', `${fullSlug}.mdx`);
    const mdPath = path.join(process.cwd(), 'src', 'content', 'navigation', `${fullSlug}.md`);

    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }
  }

  // 检查文件是否存在
  if (!filePath || !fs.existsSync(filePath)) {
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

  // 提取文章元数据
  const title = frontmatter.title || fullSlug;

  // 提取标题作为目录
  const headings: { id: string; text: string; level: number }[] = [];

  // 使用正则表达式直接从整个内容中提取标题
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

  // 确保所有标题都有唯一ID
  let processedContent = mdxContent;
  headings.forEach(heading => {
    // 替换标题行，添加ID
    const headingRegex = new RegExp(
      `^(#{${heading.level}})\\s+(${heading.text.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )})(?:\\s*{#[\\w-]+})?$`,
      'gm'
    );
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  // 读取根目录的 _meta.json 文件，获取分类的中文名称
  const rootMetaFilePath = path.join(process.cwd(), 'src', 'content', 'navigation', '_meta.json');
  let rootMeta = null;
  if (fs.existsSync(rootMetaFilePath)) {
    try {
      const rootMetaContent = fs.readFileSync(rootMetaFilePath, 'utf8');
      rootMeta = JSON.parse(rootMetaContent);
    } catch (error) {
      console.error('Error loading root _meta.json file:', error);
    }
  }

  // 构建面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '网址导航', href: '/navigation' },
    ...(slug.length > 1
      ? [
          {
            label: rootMeta && rootMeta[slug[0]] ? rootMeta[slug[0]].title : slug[0],
            href: `/navigation/${slug[0]}`,
          },
        ]
      : []),
    { label: title },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* 左侧边栏 - 导航列表 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]">
            <Suspense fallback={<div className="h-[500px] bg-muted rounded-xl shadow-sm"></div>}>
              <div className="no-animation">
                <SidebarErrorWrapper>
                  <DocSidebar
                    category="navigation"
                    currentDoc={slug.length > 1 ? slug.slice(1).join('/') : slug[0]}
                  />
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
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]">
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
