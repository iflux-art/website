import React from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { createDocBreadcrumbsServer } from "@/lib/utils/breadcrumb";
import { ContentDisplay } from "@/components/common/content-display";
import { DocPagination } from "@/components/common/pagination";
import { Sidebar } from "@/components/common/sidebar";
import { TableOfContents } from "@/components/common/table-of-contents";
import { MDXCodeEnhance } from "@/components/mdx/mdx-code-enhance";
import type {
  DocPageParams,
  DocContentResult,
  DocFrontmatter,
} from "@/types/docs-types";
import ClientMDXRenderer from "@/components/mdx/ClientMDXRenderer";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { TwikooComment } from "@/components/common/twikoo-comment";
import { getFlattenedDocsOrder } from "@/lib/content";

// 内联的路径生成函数
function generateDocPaths(): { slug: string[] }[] {
  const docsContentDir = path.join(process.cwd(), "src", "content", "docs");
  const paths: { slug: string[] }[] = [];

  function scanDirectory(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (item.name.startsWith("_")) continue;

        const newSlug = [...currentSlug, item.name];

        const indexFiles = ["index.mdx", "index.md"];
        let hasIndex = false;

        for (const indexFile of indexFiles) {
          const indexPath = path.join(itemPath, indexFile);
          if (fs.existsSync(indexPath)) {
            paths.push({ slug: newSlug });
            hasIndex = true;
            break;
          }
        }

        if (!hasIndex) {
          scanDirectory(itemPath, newSlug);
        }
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md")) &&
        !item.name.startsWith("_") &&
        !item.name.startsWith("index")
      ) {
        const fileName = item.name.replace(/\.(mdx|md)$/, "");
        paths.push({ slug: [...currentSlug, fileName] });
      }
    }
  }

  scanDirectory(docsContentDir);
  return paths;
}

// 生成静态路径
export async function generateStaticParams() {
  return generateDocPaths();
}

// 内联的内容获取函数
function getDocContentSimple(slug: string[]): DocContentResult {
  const docsContentDir = path.join(process.cwd(), "src", "content", "docs");
  const requestedPath = slug.join("/");
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;

  const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
  if (fs.existsSync(possiblePathMdx)) {
    filePath = possiblePathMdx;
  } else {
    const possiblePathMd = `${absoluteRequestedPath}.md`;
    if (fs.existsSync(possiblePathMd)) {
      filePath = possiblePathMd;
    }
  }

  if (!filePath) {
    const indexPathMdx = path.join(absoluteRequestedPath, "index.mdx");
    if (fs.existsSync(indexPathMdx)) {
      filePath = indexPathMdx;
    } else {
      const indexPathMd = path.join(absoluteRequestedPath, "index.md");
      if (fs.existsSync(indexPathMd)) {
        filePath = indexPathMd;
      }
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Document not found at path: ${requestedPath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content: originalContent, data } = matter(fileContent);
  const frontmatter = data as DocFrontmatter;

  const date = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const wordCount = originalContent.split(/\s+/).length;
  const headings = originalContent
    .split("\n")
    .filter((line: string) => line.startsWith("#"))
    .map((line: string) => {
      const level = line.match(/^#+/)?.[0]?.length || 1;
      const text = line.replace(/^#+\s*/, "");
      return { level, text, id: text.toLowerCase().replace(/\s+/g, "-") };
    });

  const topLevelCategorySlug = slug[0];
  const relativePathFromTopCategory = path
    .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
    .replace(/\\/g, "/")
    .replace(/\.(mdx|md)$/, "");

  // === 新增分页逻辑 ===
  const flatDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  const currentDocPath = `/docs/${topLevelCategorySlug}/${relativePathFromTopCategory}`;
  const currentIndex = flatDocs.findIndex(
    (item) => item.path === currentDocPath,
  );
  const prevDoc = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  return {
    content: originalContent,
    frontmatter,
    headings,
    prevDoc,
    nextDoc,
    breadcrumbs: [],
    mdxContent: originalContent,
    wordCount,
    date,
    relativePathFromTopCategory,
    topLevelCategorySlug,
    isIndexPage: path.basename(filePath, path.extname(filePath)) === "index",
  };
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

    const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

    return (
      <div className="min-h-screen bg-background">
        <MDXCodeEnhance />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center gap-10">
            <aside className="hide-scrollbar sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto lg:block">
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
                <TwikooComment />
              </div>
            </main>

            <aside className="sticky top-[80px] hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] w-72 max-w-72 shrink-0 self-start overflow-y-auto px-4 [overflow-wrap:break-word] [word-break:break-all] [white-space:normal] xl:block">
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
