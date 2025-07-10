// 页面重构：类型、配置、工具函数全部归档，页面只负责参数解析和渲染
import React from "react";
import { DocsContent } from "@/components/layout/docs/DocsContent";
import { Breadcrumb } from "@/components/common/breadcrumb/breadcrumb";
import { createDocBreadcrumbs } from "@/components/common/breadcrumb/breadcrumb-utils";
import { ContentDisplay } from "@/components/common/content-display";
import { DocPagination } from "@/components/layout/docs/pagination";
import { Sidebar } from "@/components/layout/docs/sidebar";
import { TableOfContents } from "@/components/layout/toc/table-of-contents";
import { MDXCodeEnhance } from "@/components/mdx/mdx-code-enhance";
import { getDocContent } from "@/lib/content/get-doc-content";
import type { DocPageParams, DocContentResult } from "@/types/docs-types";

export default async function DocPage({
  params,
}: {
  params: Promise<DocPageParams>;
}) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug
    : [resolvedParams.slug];
  const doc: DocContentResult = getDocContent(slug);

  // 生成面包屑
  const breadcrumbs = createDocBreadcrumbs({
    slug: doc.isIndexPage
      ? doc.topLevelCategorySlug.split("/")
      : doc.relativePathFromTopCategory.split("/"),
    title: doc.frontmatter.title,
    meta: undefined, // 如需 meta 可在 getDocContent 返回
  });

  return (
    <div className="min-h-screen bg-background">
      <MDXCodeEnhance />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center gap-10">
          <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto px-4 lg:block">
            <Sidebar
              category={doc.topLevelCategorySlug}
              currentDoc={
                doc.isIndexPage
                  ? doc.relativePathFromTopCategory
                      .split("/")
                      .slice(0, -1)
                      .join("/")
                  : doc.relativePathFromTopCategory
              }
            />
          </aside>

          <main className="max-w-4xl min-w-0 flex-1">
            <div className="mx-auto">
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
              <ContentDisplay
                contentType="docs"
                title={doc.frontmatter.title}
                date={doc.date}
                category={doc.frontmatter.category}
                tags={doc.frontmatter.tags || []}
                wordCount={doc.wordCount}
              >
                <DocsContent content={doc.content} />
              </ContentDisplay>
              <DocPagination prevDoc={doc.prevDoc} nextDoc={doc.nextDoc} />
            </div>
          </main>

          <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto px-4 [overflow-wrap:break-word] [word-break:break-all] [white-space:normal] xl:block">
            <TableOfContents
              headings={doc.headings}
              adaptive={true}
              adaptiveOffset={80}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
