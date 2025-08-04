import React from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/content/breadcrumb";
import { createDocBreadcrumbsServer } from "@/lib/breadcrumb";
import { ContentDisplay } from "@/components/content/content-display";
import { DocPagination } from "@/components/content/pagination";
import { Sidebar } from "@/components/content/sidebar";
import { TableOfContents } from "@/components/content/table-of-contents";

import { AppGrid } from "@/components/layout/app-grid";
import type { DocContentResult } from "@/types/docs-types";
import ClientMDXRenderer from "@/components/mdx/ClientMDXRenderer";
import { TwikooComment } from "@/components/layout/twikoo-comment";

type DocPageParams = {
  slug: string[];
};

// 文件顶部只保留一处 import fs 和 import path
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFlattenedDocsOrder } from "@/lib/content";
import { extractHeadings } from "@/components/content/extract-headings";
import { countWords } from "@/utils";
// 修复 Prettier 格式错误，将多行类型 import 改为单行
import type { DocFrontmatter, NavDocItem } from "@/types/docs-types";
const DOCS_CONTENT_DIR = "src/content/docs";
const DOCS_INDEX_FILES = ["index.mdx", "index.md"];

// ===== 迁移自 src/lib/content/utils.ts =====

interface ScanOptions {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}

const scanContentDirectory = (options: ScanOptions): { slug: string[] }[] => {
  const {
    contentDir,
    indexFiles = ["index.mdx", "index.md"],
    extensions = [".mdx", ".md"],
    excludePrefix = "_",
    filter = () => true,
  } = options;

  const paths: { slug: string[] }[] = [];

  function scan(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (item.name.startsWith(excludePrefix)) continue;

        const newSlug = [...currentSlug, item.name];
        let hasIndex = false;

        for (const indexFile of indexFiles) {
          const indexPath = path.join(itemPath, indexFile);
          if (fs.existsSync(indexPath) && filter(indexPath)) {
            paths.push({ slug: newSlug });
            hasIndex = true;
            break;
          }
        }

        if (!hasIndex) {
          scan(itemPath, newSlug);
        }
      } else if (
        item.isFile() &&
        extensions.some((ext) => item.name.endsWith(ext)) &&
        !item.name.startsWith(excludePrefix) &&
        !indexFiles.includes(item.name) &&
        filter(itemPath)
      ) {
        const fileName = item.name.replace(
          new RegExp(`(${extensions.join("|")})$`),
          "",
        );
        paths.push({ slug: [...currentSlug, fileName] });
      }
    }
  }

  scan(contentDir);
  return paths;
};

const generateDocPaths = (): { slug: string[] }[] => {
  return scanContentDirectory({
    contentDir: path.join(process.cwd(), "src", "content", "docs"),
    excludePrefix: "_",
  });
};

function getDocContent(slug: string[]): DocContentResult {
  const docsContentDir = path.join(process.cwd(), DOCS_CONTENT_DIR);
  const requestedPath = slug.join("/");
  const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

  let filePath: string | undefined;
  let actualSlugForNav = slug.join("/");
  let isIndexPage = false;

  if (
    fs.existsSync(absoluteRequestedPath) &&
    fs.statSync(absoluteRequestedPath).isDirectory()
  ) {
    for (const indexFile of DOCS_INDEX_FILES) {
      const indexPath = path.join(absoluteRequestedPath, indexFile);
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
        isIndexPage = true;
        break;
      }
    }
    if (!filePath) {
      const dirSpecificFlattenedDocs = getFlattenedDocsOrder(requestedPath);
      if (dirSpecificFlattenedDocs.length > 0) {
        const firstDocRelativePath = dirSpecificFlattenedDocs[0].path.replace(
          /^\/docs\//,
          "",
        );
        filePath = path.join(docsContentDir, `${firstDocRelativePath}.mdx`);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(docsContentDir, `${firstDocRelativePath}.md`);
        }
        actualSlugForNav = firstDocRelativePath;
      }
    }
  }

  if (!filePath) {
    const possiblePathMdx = `${absoluteRequestedPath}.mdx`;
    if (fs.existsSync(possiblePathMdx)) {
      filePath = possiblePathMdx;
    } else {
      const possiblePathMd = `${absoluteRequestedPath}.md`;
      if (fs.existsSync(possiblePathMd)) {
        filePath = possiblePathMd;
      }
    }
    actualSlugForNav = slug.join("/");
    isIndexPage =
      path.basename(filePath || "", path.extname(filePath || "")) === "index";
  }

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Document not found at path: ${requestedPath}`);
  }
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content: originalContent, data: frontmatter } = matter(fileContent);

  const date = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const wordCount = countWords(originalContent);
  const { headings } = extractHeadings(originalContent);
  const mdxContent = originalContent; // 页面层负责渲染
  const topLevelCategorySlug = slug[0];
  const relativePathFromTopCategory = path
    .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
    .replace(/\\/g, "/")
    .replace(/\.(mdx|md)$/, "");
  const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);
  let prevDoc: NavDocItem | null = null;
  let nextDoc: NavDocItem | null = null;

  if (isIndexPage) {
    prevDoc = null;
    const indexDirNavPath = `/docs/${actualSlugForNav}`;
    nextDoc =
      flattenedDocs.find(
        (doc) =>
          doc.path.startsWith(indexDirNavPath + "/") ||
          (doc.path.startsWith(indexDirNavPath) &&
            doc.path !== indexDirNavPath &&
            !doc.path.substring(indexDirNavPath.length + 1).includes("/")),
      ) || null;
  } else {
    const currentNavPath = `/docs/${actualSlugForNav}`;
    const currentIndex = flattenedDocs.findIndex(
      (doc) => doc.path === currentNavPath,
    );
    if (currentIndex !== -1) {
      prevDoc = currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null;
      nextDoc =
        currentIndex < flattenedDocs.length - 1
          ? flattenedDocs[currentIndex + 1]
          : null;
    }
  }

  // breadcrumbs 由页面层负责生成

  return {
    title: frontmatter.title || path.basename(filePath, path.extname(filePath)),
    content: originalContent,
    frontmatter: frontmatter as DocFrontmatter,
    headings,
    prevDoc,
    nextDoc,
    breadcrumbs: [], // 页面层生成
    mdxContent,
    wordCount,
    date,
    relativePathFromTopCategory,
    topLevelCategorySlug,
    isIndexPage,
  };
}

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
    const doc: DocContentResult = getDocContent(slug);

    const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <AppGrid columns={5} gap="large">
            {/* 左侧边栏 - 文档导航 */}
            <aside className="hide-scrollbar sticky top-20 col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:block">
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

            {/* 主内容区 - 占3列 */}
            <main className="col-span-1 min-w-0 lg:col-span-1 xl:col-span-3">
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
              <ContentDisplay
                contentType="docs"
                title={doc.frontmatter.title}
                date={doc.date}
                wordCount={doc.wordCount}
              >
                <ClientMDXRenderer content={doc.content} />
              </ContentDisplay>
              <DocPagination prevDoc={doc.prevDoc} nextDoc={doc.nextDoc} />
              <TwikooComment />
            </main>

            {/* 右侧边栏 - TOC */}
            <aside className="sticky top-[80px] col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-hidden xl:block">
              <TableOfContents
                headings={doc.headings}
                adaptive={true}
                adaptiveOffset={80}
                className="prose-sm"
              />
            </aside>
          </AppGrid>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
