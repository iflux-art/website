import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllDocsStructure } from "@/components/sidebar/global-docs";
import { Breadcrumb } from "@/components/content/breadcrumb";
import { createDocBreadcrumbsServer } from "@/features/docs/lib";
import { ContentDisplay } from "@/components/content/content-display";
import { DocPagination } from "@/components/content/pagination";
import { DocsSidebarWrapper } from "@/components/sidebar/docs-sidebar-wrapper";
import { TableOfContents } from "@/components/content/table-of-contents";
import { AppGrid } from "@/components/layout/app-grid";
import ClientMDXRenderer from "@/components/mdx/ClientMDXRenderer";
import { TwikooComment } from "@/components/comment/twikoo-comment";

// 导入文档处理函数
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFlattenedDocsOrder } from "@/features/docs/lib";
import { extractHeadings } from "@/components/content/extract-headings";
import type { DocContentResult } from "@/features/docs/types";

// 文档内容处理函数
function countWords(text: string): number {
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_~>|-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return chineseChars.length + englishWords.length;
}

function getFirstDocContent(): DocContentResult | null {
  try {
    const structure = getAllDocsStructure();

    if (!structure || !structure.firstDocPath || structure.totalDocs === 0) {
      return null;
    }

    // 从 firstDocPath 中提取 slug
    const firstDocPath = structure.firstDocPath.replace(/^\/docs\//, "");
    const slug = firstDocPath.split("/");

    const docsContentDir = path.join(process.cwd(), "src", "content", "docs");
    const requestedPath = slug.join("/");
    const absoluteRequestedPath = path.join(docsContentDir, requestedPath);

    let filePath: string | undefined;
    const actualSlugForNav = slug.join("/");
    let isIndexPage = false;

    // 检查是否为目录
    if (
      fs.existsSync(absoluteRequestedPath) &&
      fs.statSync(absoluteRequestedPath).isDirectory()
    ) {
      // 查找 index 文件
      for (const indexFile of ["index.mdx", "index.md"]) {
        const indexPath = path.join(absoluteRequestedPath, indexFile);
        if (fs.existsSync(indexPath)) {
          filePath = indexPath;
          isIndexPage = true;
          break;
        }
      }
    }

    // 如果不是目录或没有 index 文件，尝试作为文件
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
    }

    if (!filePath || !fs.existsSync(filePath)) {
      return null;
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
    const topLevelCategorySlug = slug[0];
    const flattenedDocs = getFlattenedDocsOrder(topLevelCategorySlug);

    let prevDoc = null;
    let nextDoc = null;

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

    return {
      title:
        frontmatter.title || path.basename(filePath, path.extname(filePath)),
      content: originalContent,
      frontmatter: frontmatter as any,
      headings,
      prevDoc,
      nextDoc,
      breadcrumbs: [],
      mdxContent: originalContent,
      wordCount,
      date,
      relativePathFromTopCategory: path
        .relative(path.join(docsContentDir, topLevelCategorySlug), filePath)
        .replace(/\\/g, "/")
        .replace(/\.(mdx|md)$/, ""),
      topLevelCategorySlug,
      isIndexPage,
    };
  } catch (error) {
    console.error("Error getting first doc content:", error);
    return null;
  }
}

export default async function DocsPage() {
  try {
    const structure = getAllDocsStructure();

    // 验证结构和路径
    if (!structure || !structure.firstDocPath || structure.totalDocs === 0) {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto py-8">
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <h1 className="mb-4 text-3xl font-bold text-destructive">
                文档不可用
              </h1>
              <p className="mb-6 max-w-md text-muted-foreground">
                当前没有可用的文档内容。请检查文档配置或联系管理员。
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // 获取第一个文档的内容
    const doc = getFirstDocContent();

    if (!doc) {
      notFound();
    }

    // 从 firstDocPath 中提取 slug 用于面包屑
    const firstDocPath = structure.firstDocPath.replace(/^\/docs\//, "");
    const slug = firstDocPath.split("/");
    const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <AppGrid columns={5} gap="large">
            {/* 左侧边栏 - 全局文档导航 */}
            <aside className="hide-scrollbar sticky top-20 col-span-1 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:block">
              <DocsSidebarWrapper currentDoc={structure.firstDocPath} />
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
  } catch (error) {
    console.error("Error in docs page:", error);
    notFound();
  }
}
