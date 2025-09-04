import { ThreeColumnLayout } from "@/components/layout";
import { TableOfContentsCard } from "@/features/navigation";
import { ClientMDXRenderer } from "@/features/content/components/mdx";
import { TwikooComment } from "@/features/comment";
import { ContentDisplay } from "@/features/content/components/display";
import { DocPagination } from "@/features/navigation";
import { DocErrorHandler, DocsSidebarCard } from "@/features/docs/components";
import {
  createDocBreadcrumbsServer,
  generateDocPathsFromFeatures,
  getDocContentFromFeatures,
  isRedirectLoop,
  resolveDocPath,
} from "@/features/docs/lib";
import { generateDocsMetadata } from "@/lib/metadata/seo-utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface DocPageParams {
  slug: string[];
}

// ===== 优化的静态生成配置 =====

/**
 * 生成静态路径 - 优化版本
 * 使用 generateDocPathsFromFeatures 函数获取完整的路径列表
 * 实现文档结构缓存以提高构建性能
 */
export function generateStaticParams() {
  const allPaths = generateDocPathsFromFeatures();
  return allPaths;
}

/**
 * 启用增量静态再生 (ISR)
 * 当文档内容更新时，系统能够增量重新生成相关页面
 */
export const revalidate = 3600; // 1小时重新验证一次

/**
 * 启用动态路径生成
 * 对于未在 generateStaticParams 中预生成的路径，允许动态生成
 */
export const dynamicParams = true;

/**
 * 生成页面元数据
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<DocPageParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];

  try {
    const doc = getDocContentFromFeatures(slug);
    return generateDocsMetadata({
      title: doc.frontmatter.title,
      description: doc.frontmatter.description || "文档页面",
      section: "文档",
      lastUpdated: doc.date || undefined,
    });
  } catch {
    return generateDocsMetadata({
      title: "文档未找到",
      description: "请求的文档页面不存在",
      section: "文档",
    });
  }
}

const DocPage = async ({ params }: { params: Promise<DocPageParams> }) => {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];

  // 路径解析和重定向处理
  const pathResolution = resolveDocPath(slug);

  // 处理重定向情况
  if (pathResolution.type === "redirect" && pathResolution.redirectTo) {
    const currentPath = `/docs/${slug.join("/")}`;
    if (isRedirectLoop(currentPath, pathResolution.redirectTo)) {
      return <DocErrorHandler errorType="redirect-loop" slug={slug} />;
    }
    redirect(pathResolution.redirectTo);
  }

  // 处理未找到的情况
  if (pathResolution.type === "notfound") {
    return <DocErrorHandler errorType="not-found" slug={slug} />;
  }

  // 获取文档内容
  let doc: ReturnType<typeof getDocContentFromFeatures> | null = null;
  try {
    doc = getDocContentFromFeatures(slug);
  } catch (error) {
    return <DocErrorHandler errorType="content-error" slug={slug} error={error as Error} />;
  }

  // 生成面包屑导航
  const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

  // 左侧边栏内容 - 文档导航
  const leftSidebar = <DocsSidebarCard currentDoc={`/docs/${slug.join("/")}`} />;

  // 右侧边栏内容 - 目录导航
  const rightSidebar = <TableOfContentsCard headings={doc.headings} className="prose-sm" />;

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
        layout="double-sidebar"
      >
        {/* 文档主内容 */}
        <div className="space-y-6">
          {/* 文档内容展示 */}
          <ContentDisplay
            contentType="docs"
            title={doc.frontmatter.title}
            date={doc.date}
            updatedAt={doc.update}
            wordCount={doc.wordCount}
            breadcrumbs={breadcrumbs}
          >
            <ClientMDXRenderer content={doc.content} />
          </ContentDisplay>

          {/* 文档分页导航 */}
          <DocPagination prevDoc={doc.prevDoc} nextDoc={doc.nextDoc} />

          {/* 评论区 */}
          <TwikooComment />
        </div>
      </ThreeColumnLayout>
    </div>
  );
};

export default DocPage;
