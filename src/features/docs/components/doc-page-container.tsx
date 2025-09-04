import { ThreeColumnLayout } from "@/components/layout";
import { TableOfContentsCard } from "@/features/navigation";
import ClientMDXRenderer from "@/features/content/components/mdx/client-mdx-renderer";
import { TwikooComment } from "@/features/comment";
import { ContentDisplay } from "@/features/content/components/display";
import { DocPagination } from "@/features/navigation";
import { DocsSidebarCard } from "@/features/docs/components";
import { createDocBreadcrumbsServer, getDocContentFromFeatures } from "@/features/docs/lib";
import { isRedirectLoop, resolveDocPath } from "@/features/docs/lib/doc-path-resolver";
import type { DocContentResult } from "@/features/docs/types";
import { redirect } from "next/navigation";
import { DocErrorHandler } from "./doc-error-handler";

interface DocPageContainerProps {
  slug: string[];
}

/**
 * 文档页面容器组件
 * 负责处理文档内容的获取、渲染和布局
 */
export const DocPageContainer = ({ slug }: DocPageContainerProps) => {
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
  let doc: DocContentResult;
  try {
    doc = getDocContentFromFeatures(slug);
  } catch (error) {
    return <DocErrorHandler errorType="content-error" slug={slug} error={error as Error} />;
  }

  // 生成面包屑导航
  const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

  // 左侧边栏内容
  const leftSidebar = <DocsSidebarCard currentDoc={`/docs/${slug.join("/")}`} />;

  // 右侧边栏内容
  const rightSidebar = <TableOfContentsCard headings={doc.headings} className="prose-sm" />;

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
        <ContentDisplay
          contentType="docs"
          title={doc.frontmatter.title}
          date={doc.date}
          wordCount={doc.wordCount}
          breadcrumbs={breadcrumbs}
        >
          <ClientMDXRenderer content={doc.content} />
        </ContentDisplay>
        <DocPagination prevDoc={doc.prevDoc} nextDoc={doc.nextDoc} />
        <TwikooComment />
      </ThreeColumnLayout>
    </div>
  );
};
