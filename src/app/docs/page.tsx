import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateDocsMetadata } from '@/lib/seo-utils';
import { getAllDocsStructure, DocsSidebarCard } from '@/features/docs/components';
import { getDocContentFromFeatures, createDocBreadcrumbsServer } from '@/features/docs/lib';
import { ThreeColumnLayout } from '@/features/layout';
import { ContentDisplay, DocPagination, TableOfContentsCard } from '@/features/content';
import { TwikooComment } from '@/features/comment';
import { ClientMDXRenderer } from '@/components/mdx';
import type { Metadata } from 'next';

/**
 * 获取第一个文档内容
 */
function getFirstDocContent(): ReturnType<typeof getDocContentFromFeatures> | null {
  try {
    const structure = getAllDocsStructure();

    if (!structure?.firstDocPath || structure.totalDocs === 0) {
      return null;
    }

    const firstDocPath = structure.firstDocPath.replace(/^\/docs\//, '');
    const slug = firstDocPath.split('/');

    return getDocContentFromFeatures(slug);
  } catch (error) {
    console.error('Error getting first doc content:', error as Error);
    return null;
  }
}

/**
 * 生成文档页面元数据
 */
export async function generateMetadata(): Promise<Metadata> {
  const structure = getAllDocsStructure();
  const doc = getFirstDocContent();

  if (!doc || !structure) {
    return generateDocsMetadata({
      title: '文档不可用',
      description: '当前没有可用的文档内容',
    });
  }

  return generateDocsMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description || '文档页面',
    section: '文档',
    lastUpdated: doc.date || undefined,
  });
}

export default async function DocsPage() {
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
    const firstDocPath = structure.firstDocPath.replace(/^\/docs\//, '');
    const slug = firstDocPath.split('/');
    const breadcrumbs = createDocBreadcrumbsServer(slug, doc.frontmatter.title);

    // 左侧边栏内容 - 文档导航
    const leftSidebar = <DocsSidebarCard currentDoc={structure.firstDocPath} />;

    // 右侧边栏内容 - 目录导航
    const rightSidebar = <TableOfContentsCard headings={doc.headings} className="prose-sm" />;

    return (
      <div className="min-h-screen bg-background">
        <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
          {/* 文档主内容 */}
          <div className="space-y-6">
            {/* 文档内容展示 */}
            <ContentDisplay
              contentType="docs"
              title={doc.frontmatter.title}
              date={doc.date}
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
  } catch (error) {
    console.error('Error in docs home page:', error);
    notFound();
  }
}
