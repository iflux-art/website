import { NextResponse } from 'next/server';
import { getNavigationData } from '@/hooks/use-navigation';
import { getAllPosts } from '@/hooks/use-blog';
import { getAllDocs } from '@/hooks/use-docs';
import { adminIndex } from '@/lib/algolia';
import type { AlgoliaSearchResult } from '@/lib/algolia';
import type { BlogPost } from '@/hooks/use-blog';
import type { DocItem } from '@/hooks/use-docs';

// 验证管理员密钥
const validateAdminKey = (key: string) => {
  return key === process.env.ALGOLIA_ADMIN_KEY;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminKey } = body;

    if (!validateAdminKey(adminKey)) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      );
    }

    // 并行获取所有数据
    const [docsData, blogData, navData] = await Promise.all([
      getAllDocs(),
      getAllPosts(),
      getNavigationData()
    ]);

    // 准备 Algolia 记录
    const records: AlgoliaSearchResult[] = [
      // 文档记录
      ...docsData.map((doc: DocItem) => ({
        objectID: doc.slug,
        title: doc.title,
        description: doc.description,
        url: `/docs/${doc.slug}`,
        type: 'doc' as const,
        category: doc.category,
        tags: doc.tags
      })),
      // 博客记录
      ...blogData.map((blog: BlogPost) => ({
        objectID: blog.slug,
        title: blog.title,
        description: blog.description,
        url: `/blog/${blog.slug}`,
        type: 'blog' as const,
        tags: blog.tags
      })),
      // 工具记录
      ...navData.tools.map((tool: { id: string; title: string; description: string; category: string }) => ({
        objectID: tool.id,
        title: tool.title,
        description: tool.description,
        url: `/tools/${tool.id}`,
        type: 'tool' as const,
        category: tool.category
      }))
    ];

    // 同步到 Algolia
    await adminIndex.saveObjects(records);

    return NextResponse.json({
      success: true,
      stats: {
        docs: docsData.length,
        blogs: blogData.length,
        tools: navData.tools.length,
        total: records.length
      }
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    );
  }
}