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
    } else {
      // 尝试查找子目录中的 index 文件
      const indexMdxPath = path.join(
        process.cwd(),
        'src',
        'content',
        'navigation',
        category,
        pageName,
        'index.mdx'
      );
      const indexMdPath = path.join(
        process.cwd(),
        'src',
        'content',
        'navigation',
        category,
        pageName,
        'index.md'
      );

      if (fs.existsSync(indexMdxPath)) {
        filePath = indexMdxPath;
        console.log(`找到导航子目录索引文件: ${filePath}`);
      } else if (fs.existsSync(indexMdPath)) {
        filePath = indexMdPath;
        console.log(`找到导航子目录索引文件: ${filePath}`);
      }
    }
  } else {
    // 单段路径，首先检查是否存在该目录
    const categoryDir = path.join(process.cwd(), 'src', 'content', 'navigation', fullSlug);

    if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
      // 首先检查是否存在 index.mdx 或 index.md 文件（最高优先级）
      const indexMdxPath = path.join(categoryDir, 'index.mdx');
      const indexMdPath = path.join(categoryDir, 'index.md');

      if (fs.existsSync(indexMdxPath)) {
        filePath = indexMdxPath;
        console.log(`找到导航目录索引文件(最高优先级): ${filePath}`);
      } else if (fs.existsSync(indexMdPath)) {
        filePath = indexMdPath;
        console.log(`找到导航目录索引文件(最高优先级): ${filePath}`);
      } else {
        // 如果没有 index 文件，检查是否存在 _meta.json 文件
        const metaPath = path.join(categoryDir, '_meta.json');
        let meta: Record<string, { order?: number; title?: string }> = {};

        if (fs.existsSync(metaPath)) {
          try {
            // 读取 _meta.json 文件
            const metaContent = fs.readFileSync(metaPath, 'utf8');
            meta = JSON.parse(metaContent);
            console.log(`找到导航目录 _meta.json 文件: ${metaPath}`);

            // 根据 meta 配置排序文件
            const files = fs
              .readdirSync(categoryDir)
              .filter(
                file => (file.endsWith('.mdx') || file.endsWith('.md')) && !file.startsWith('_')
              );

            // 如果有文件，根据 meta 配置排序
            if (files.length > 0) {
              // 根据 meta 配置排序
              const sortedFiles = files.sort((a, b) => {
                const aSlug = a.replace(/\.(mdx|md)$/, '');
                const bSlug = b.replace(/\.(mdx|md)$/, '');

                // 处理两种可能的 _meta.json 格式
                // 1. { "file-name": { order: 1, title: "Title" } }
                // 2. { "file-name": "Title" }
                const aConfig = meta[aSlug];
                const bConfig = meta[bSlug];

                // 如果 meta 中有该文件的配置
                if (aConfig !== undefined && bConfig !== undefined) {
                  // 如果两个文件都在 meta 中有配置
                  if (typeof aConfig === 'object' && typeof bConfig === 'object') {
                    // 如果配置是对象，使用 order 属性
                    const aOrder = aConfig.order || 999;
                    const bOrder = bConfig.order || 999;
                    return aOrder - bOrder;
                  } else {
                    // 如果配置不是对象（可能是字符串），按照在 meta 中的顺序排序
                    // 这里我们使用 Object.keys 获取所有键，然后比较它们的索引
                    const keys = Object.keys(meta);
                    return keys.indexOf(aSlug) - keys.indexOf(bSlug);
                  }
                } else if (aConfig !== undefined) {
                  // 如果只有 a 在 meta 中有配置，a 排在前面
                  return -1;
                } else if (bConfig !== undefined) {
                  // 如果只有 b 在 meta 中有配置，b 排在前面
                  return 1;
                } else {
                  // 如果都没有配置，按字母顺序排序
                  return aSlug.localeCompare(bSlug);
                }
              });

              // 使用排序后的第一个文件
              filePath = path.join(categoryDir, sortedFiles[0]);
              console.log(`根据 _meta.json 排序后的第一个文件: ${filePath}`);
            }
          } catch (error) {
            console.error(`解析 ${fullSlug} 的 _meta.json 文件失败:`, error);
          }
        }

        // 如果没有找到文件或没有 _meta.json，尝试查找该目录下的第一个文件
        if (!filePath) {
          const files = fs
            .readdirSync(categoryDir)
            .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
            .sort();

          if (files.length > 0) {
            filePath = path.join(categoryDir, files[0]);
            console.log(`找到导航目录下的第一个文件: ${filePath}`);
          }
        }
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
            <Suspense>
              <div className="no-animation">
                <SidebarErrorWrapper>
                  <DocSidebar
                    category="navigation"
                    currentDoc={slug.length > 1 ? slug.slice(1).join('/') : slug[0]}
                    isNavigation={true}
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
            <Suspense>
              {/* 使用自适应侧边栏组件显示文档目录 */}
              <AdaptiveSidebar headings={headings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
