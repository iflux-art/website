import React from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { createDocBreadcrumbsServer } from "@/lib/utils/breadcrumb";
import { ContentDisplay } from "@/components/common/content-display";
import { DocPagination } from "@/components/common/pagination";
import { Sidebar } from "@/components/common/sidebar";
import { TableOfContents } from "@/components/common/table-of-contents";
import { MDXCodeEnhance } from "@/components/mdx/mdx-code-enhance";
import { generateDocPaths } from "@/lib/content/get-doc-content";
import { getDocContentSimple } from "@/lib/content/get-doc-content-simple";
import type { DocPageParams, DocContentResult } from "@/types/docs-types";
import ClientMDXRenderer from "@/components/mdx/ClientMDXRenderer";

// 生成静态路径
export async function generateStaticParams() {
  return generateDocPaths();
}

export default async function DocPage({
  params,
}: {
  params: Promise<DocPageParams>;
}) {
  try {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug)
      ? resolvedParams.slug
      : [resolvedParams.slug];
    const doc: DocContentResult = getDocContentSimple(slug);

    // 生成面包屑（服务端）
    const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

    return (
      <div className="min-h-screen bg-background">
        <MDXCodeEnhance />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center gap-10">
            <aside className="sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto lg:block">
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
                  <ClientMDXRenderer content={doc.content} />
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
  } catch {
    notFound();
  }
}
