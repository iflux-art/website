import { ThreeColumnLayout } from "@/components/layout";
import { TableOfContentsCard } from "@/features/navigation";
import ClientMDXRenderer from "@/features/content/components/mdx/client-mdx-renderer";
import { TwikooComment } from "@/features/comment";
import { ContentDisplay } from "@/features/content/components/display";
import { DocPagination } from "@/features/navigation";
import { DocsSidebarCard, getAllDocsStructure } from "@/features/docs/components";
import { createDocBreadcrumbsServer, getDocContentFromFeatures } from "@/features/docs/lib";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * 获取第一个文档内容
 */
function getFirstDocContent(): ReturnType<typeof getDocContentFromFeatures> | null {
  try {
    const structure = getAllDocsStructure();

    if (!structure?.firstDocPath || structure.totalDocs === 0) {
      return null;
    }

    const firstDocPath = structure.firstDocPath.replace(/^\/docs\//, "");
    const slug = firstDocPath.split("/");

    return getDocContentFromFeatures(slug);
  } catch (error) {
    console.error("Error getting first doc content:", error as Error);
    return null;
  }
}

/**
 * 文档首页容器组件
 *
 * 从原始 docs 页面中拆分的业务逻辑，负责处理文档结构验证、
 * 内容获取和渲染。遵循项目架构分离原则。
 */
export function DocsHomePage() {
  try {
    const structure = getAllDocsStructure();

    // 验证结构和路径
    if (!structure?.firstDocPath || structure.totalDocs === 0) {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto py-8">
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <h1 className="mb-4 text-3xl font-bold text-destructive">文档不可用</h1>
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

    // 左侧边栏内容
    const leftSidebar = <DocsSidebarCard currentDoc={structure.firstDocPath} />;

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
  } catch (error) {
    console.error("Error in docs home page:", error);
    notFound();
  }
}
