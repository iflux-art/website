import React from 'react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb as BreadcrumbComponent, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Sidebar } from '@/components/ui/sidebar';
import { TableOfContents } from '@/components/ui/table-of-contents';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { getFlattenedDocsOrder, NavDocItem, DocMetaItem } from '@/lib/content';

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];
  
  const docsContentDir = path.join(process.cwd(), 'src', 'content', 'docs');
  const requestedPath = slug.join('/'); 
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;
  let actualSlugForNav = slug.join('/'); // Represents the logical path for navigation and breadcrumbs
  let isIndexPage = false;
  // let isDirectoryRequest = false; // Unused variable

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
      // No index file, get the first doc from sidebar order for this directory
      // getFlattenedDocsOrder now takes topLevelCategory, so we need a way to get first item of a sub-directory
      // For now, let's assume DocPage will always resolve to a file if slug is a dir without index.
      // This part of the logic might need refinement if a directory URL should auto-resolve to its first non-index doc.
      // For now, if no index, and it's a dir, it will lead to notFound unless slug points to a file.
      // Let's simplify: if it's a dir and no index, it will eventually try to load a file based on slug.
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
  
  if (!filePath) { // If it wasn't a directory or directory processing didn't set filePath
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
    isIndexPage = path.basename(filePath || "", path.extname(filePath || "")) === 'index';
  }


  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`[DocPage] Document not found for slug: ${slug.join('/')}.`);
    notFound();
  }

  console.log(`[DocPage] Rendering file: ${filePath}. actualSlugForNav: ${actualSlugForNav}, isIndexPage: ${isIndexPage}`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content: originalContent, data: frontmatter } = matter(fileContent);
  const content = originalContent; // TOC extraction uses originalContent

  const topLevelCategorySlug = slug[0];
  
  // Determine docNameForSidebar: relative path from its top-level category for highlighting
  const relativePathFromTopCategory = path.relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
                                      .replace(/\\/g, '/')
                                      .replace(/\.(mdx|md)$/, '');

  // Prev/Next logic using topLevelCategorySlug for a global order
  const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  let prevDoc: NavDocItem | null = null;
  let nextDoc: NavDocItem | null = null;

  if (isIndexPage) {
    prevDoc = null; // Requirement 2: index.mdx has no "previous" page in its own context
    // Requirement 2: "next" page is the first item in its directory's flattened list
    // actualSlugForNav for an index page is its directory path (e.g., "category" or "category/sub").
    // We need the first item from flattenedDocs that is "under" this directory.
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    nextDoc = flattenedDocs.find(doc => doc.path.startsWith(indexDirNavPath + '/') || (doc.path.startsWith(indexDirNavPath) && doc.path !== indexDirNavPath && !doc.path.substring(indexDirNavPath.length+1).includes('/'))) || null;

  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(doc => doc.path === currentNavPath);
    if (currentIndex !== -1) {
      prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
      nextDoc = currentIndex < flattenedDocs.length - 1 ? flattenedDocs[currentIndex + 1] : null;
    } else {
        console.warn(`[DocPage] Current path ${currentNavPath} not found in flattenedDocs for prev/next.`);
    }
  }

  // Root meta for category titles
  const rootMetaFilePath = path.join(docsContentDir, '_meta.json');
  let rootMeta: Record<string, DocMetaItem | string> | null = null;
  if (fs.existsSync(rootMetaFilePath)) {
    try {
      rootMeta = JSON.parse(fs.readFileSync(rootMetaFilePath, 'utf8'));
    } catch (error) {
      console.error('Error loading root _meta.json file:', error);
    }
  }

  // TOC Headings Extraction
  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;
  while ((match = headingRegex.exec(originalContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const customId = match[3];
    const id = customId || `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${match.index}`;
    if (level >= 1 && level <= 4) {
      headings.push({ id, text, level });
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
        // For index page, label is its directory name, which is 'segment'
        // If 'segment' is a category, its title might be in rootMeta
        // If 'segment' is a sub-category, its title might be in parent's _meta.json (harder to get here)
        // For simplicity, keep 'segment' or enhance if parent meta is available.
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
            <Sidebar category={topLevelCategorySlug} currentDoc={isIndexPage ? path.dirname(relativePathFromTopCategory) : relativePathFromTopCategory} />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              <div className="mb-6">
                <BreadcrumbComponent items={breadcrumbItems} />
              </div>
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold mb-8 tracking-tight">{frontmatter.title}</h1>
                  <MarkdownRenderer content={content} />
              </article>

              {(prevDoc || nextDoc) && (
                <div className="mt-12 flex justify-between gap-4">
                  {prevDoc ? (
                    <Card className="flex-1 max-w-[48%] shadow-sm rounded-xl hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <Link href={prevDoc.path} className="flex flex-col">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            上一页
                          </span>
                          <span className="font-semibold tracking-tight">{prevDoc.title}</span>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : ( <div className="flex-1 max-w-[48%]"></div> )}
                  {nextDoc ? (
                    <Card className="flex-1 max-w-[48%] shadow-sm rounded-xl hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <Link href={nextDoc.path} className="flex flex-col items-end text-right">
                          <span className="text-sm text-muted-foreground flex items-center">
                            下一页
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </span>
                          <span className="font-semibold tracking-tight">{nextDoc.title}</span>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : ( <div className="flex-1 max-w-[48%]"></div> )}
                </div>
              )}
            </div>
          </main>

          <aside className="hidden xl:block w-64 shrink-0 self-start sticky top-20 max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto">
            <TableOfContents headings={headings} adaptive={true} />
          </aside>
        </div>
      </div>
    </div>
  );
}