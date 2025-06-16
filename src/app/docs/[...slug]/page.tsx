import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { countWords } from '@/lib/utils';
import { DocPagination } from '@/components/layout/docs/doc-pagination';
import {
  Breadcrumb as BreadcrumbComponent,
  type BreadcrumbItem,
} from '@/components/common/breadcrumb';
import { Sidebar } from '@/components/layout/docs/sidebar';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { TableOfContents } from '@/components/layout/toc/table-of-contents';
import { extractHeadings } from '@/components/layout/toc/extract-headings';
import { getFlattenedDocsOrder, NavDocItem, DocMetaItem } from '@/lib/content';
import { ContentDisplay } from '@/components/common/content-display';
export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];

  const docsContentDir = path.join(process.cwd(), 'src', 'content', 'docs');
  const requestedPath = slug.join('/');
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;
  let actualSlugForNav = slug.join('/'); // Represents the logical path for navigation and breadcrumbs
  let isIndexPage = false;
  // let isDirectoryRequest = false; // 未使用的变量

  if (fs.existsSync(absoluteRequestedPath) && fs.statSync(absoluteRequestedPath).isDirectory()) {
    // isDirectoryRequest = true; // Unused variable
    const indexMdxPath = path.join(absoluteRequestedPath, 'index.mdx');
    const indexMdPath = path.join(absoluteRequestedPath, 'index.md');

    if (fs.existsSync(indexMdxPath)) {
      filePath = indexMdxPath;
      isIndexPage = true;
      // actualSlugForNav remains the directory path for index pages
    } else if (fs.existsSync(indexMdPath)) {
      filePath = indexMdPath;
      isIndexPage = true;
    } else {
      // 没有索引文件，从此目录的侧边栏顺序中获取第一个文档
      // getFlattenedDocsOrder 现在接受 topLevelCategory，所以我们需要一种方法来获取子目录的第一个项目
      // 目前，让我们假设如果目录没有索引，DocPage 将始终解析到文件
      // 如果目录 URL 应该自动解析到其第一个非索引文档，这部分逻辑可能需要改进
      // 目前，如果没有索引且是目录，除非 slug 指向文件，否则将抛出错误
      // 简化：如果是目录且没有索引，最终将尝试基于 slug 加载文件
      // The user requirement is: "if content/docs 目录下有 index.mdx ，则在浏览器中输入该文件夹的路径，默认打开的就是 index.mdx 文件"
      // "index.mdx > _meta.json > 默认排序" - this implies if no index, first from sorted list.
      // We can use getFlattenedDocsOrder for the *specific directory* to find its first item.
      const dirSpecificFlattenedDocs = getFlattenedDocsOrder(requestedPath); // Pass the dir path itself
      if (dirSpecificFlattenedDocs.length > 0) {
        const firstDocRelativePath = dirSpecificFlattenedDocs[0].path.replace(/^\/docs\//, '');
        filePath = path.join(docsContentDir, `${firstDocRelativePath}.mdx`);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(docsContentDir, `${firstDocRelativePath}.md`);
        }
        actualSlugForNav = firstDocRelativePath;
      }
    }
  }

  if (!filePath) {
    // 如果不是目录或目录处理未设置 filePath
    const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
    if (fs.existsSync(possiblePathMdx)) {
      filePath = possiblePathMdx;
    } else {
      const possiblePathMd = `${absoluteRequestedPath}.md`;
      if (fs.existsSync(possiblePathMd)) {
        filePath = possiblePathMd;
      }
    }
    actualSlugForNav = slug.join('/'); // If it's a direct file request, actualSlugForNav is the slug itself
    isIndexPage = path.basename(filePath || '', path.extname(filePath || '')) === 'index';
  }

  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`[DocPage] Document not found for slug: ${slug.join('/')}.`);
    throw new Error(`Document not found for slug: ${slug.join('/')}`);
  }

  console.log(
    `[DocPage] Rendering file: ${filePath}. actualSlugForNav: ${actualSlugForNav}, isIndexPage: ${isIndexPage}`
  );
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content: originalContent, data: frontmatter } = matter(fileContent);

  // 格式化日期
  const date = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // 计算字数
  const wordCount = countWords(originalContent);

  // 从原始内容中提取标题，但保持原始内容不变
  const { headings } = extractHeadings(originalContent);

  // 直接使用原始内容进行渲染
  const mdxContent = await MDXRenderer({ content: originalContent });

  const topLevelCategorySlug = slug[0];

  // 确定 docNameForSidebar：从顶级分类计算相对路径，用于高亮显示
  const relativePathFromTopCategory = path
    .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
    .replace(/\\/g, '/')
    .replace(/\.(mdx|md)$/, '');

  // 使用顶级分类 slug 计算前后页面逻辑
  const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  let prevDoc: NavDocItem | null = null;
  let nextDoc: NavDocItem | null = null;

  if (isIndexPage) {
    prevDoc = null; // 需求2：index.mdx 在其自身上下文中没有"上一页"
    // 需求2："下一页"是其目录展平列表中的第一个项目
    // 索引页面的 actualSlugForNav 是其目录路径（例如："category"或"category/sub"）
    // 我们需要从 flattenedDocs 中获取该目录下的第一个项目
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    nextDoc =
      flattenedDocs.find(
        doc =>
          doc.path.startsWith(indexDirNavPath + '/') ||
          (doc.path.startsWith(indexDirNavPath) &&
            doc.path !== indexDirNavPath &&
            !doc.path.substring(indexDirNavPath.length + 1).includes('/'))
      ) || null;
  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(doc => doc.path === currentNavPath);
    if (currentIndex !== -1) {
      prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
      nextDoc = currentIndex < flattenedDocs.length - 1 ? flattenedDocs[currentIndex + 1] : null;
    } else {
      console.warn(
        `[DocPage] Current path ${currentNavPath} not found in flattenedDocs for prev/next.`
      );
    }
  }

  // 根目录元数据，用于分类标题
  const rootMetaFilePath = path.join(docsContentDir, '_meta.json');
  let rootMeta: Record<string, DocMetaItem | string> | null = null;
  if (fs.existsSync(rootMetaFilePath)) {
    try {
      rootMeta = JSON.parse(fs.readFileSync(rootMetaFilePath, 'utf8'));
    } catch (error) {
      console.error('Error loading root _meta.json file:', error);
    }
  }

  // Breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = [{ label: '文档', href: '/docs' }];
  let currentBreadcrumbPath = '/docs';
  const navPathSegments = actualSlugForNav.split('/');

  navPathSegments.forEach((segment, index) => {
    const isLastSegment = index === navPathSegments.length - 1;
    currentBreadcrumbPath += `/${segment}`;
    let label = segment;

    if (index === 0 && rootMeta) {
      const metaEntry = rootMeta[segment];
      if (typeof metaEntry === 'string') label = metaEntry;
      else if (typeof metaEntry === 'object' && metaEntry.title) label = metaEntry.title;
    } else if (isLastSegment && !isIndexPage) {
      label = frontmatter.title || segment;
    } else if (isLastSegment && isIndexPage) {
      // 对于索引页面，标签使用其目录名称（segment）
      // 如果是分类，其标题可能在 rootMeta 中
      // 如果是子分类，其标题可能在父级的 _meta.json 中（这里较难获取）
      // 为简单起见，保持使用 segment 或在有父级元数据时增强
    }

    if (isLastSegment) {
      breadcrumbItems.push({ label }); // Current page, no href
    } else {
      breadcrumbItems.push({ label, href: currentBreadcrumbPath });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto">
            <Sidebar
              category={topLevelCategorySlug}
              currentDoc={
                isIndexPage
                  ? path.dirname(relativePathFromTopCategory)
                  : relativePathFromTopCategory
              }
            />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              <div className="mb-6">
                <BreadcrumbComponent items={breadcrumbItems} />
              </div>
              <ContentDisplay
                contentType="docs"
                title={frontmatter.title}
                date={date}
                category={frontmatter.category}
                tags={frontmatter.tags || []}
                wordCount={wordCount}
              >
                {mdxContent}
              </ContentDisplay>
              <DocPagination prevDoc={prevDoc} nextDoc={nextDoc} />
            </div>
          </main>

          <aside className="hidden xl:block w-64 shrink-0 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto">
            <TableOfContents headings={headings} adaptive={true} adaptiveOffset={80} />
          </aside>
        </div>
      </div>
    </div>
  );
}
