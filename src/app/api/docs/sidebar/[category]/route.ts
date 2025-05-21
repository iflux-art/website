import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDocSidebar } from '@/lib/docs-fs';

/**
 * 获取指定分类的侧边栏结构的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含分类名称
 * @returns 指定分类的侧边栏结构
 */
export function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    const decodedCategory = decodeURIComponent(category);

    // 检查分类是否存在
    const categoryDir = path.join(process.cwd(), 'src', 'content', 'docs', decodedCategory);

    if (!fs.existsSync(categoryDir) || !fs.statSync(categoryDir).isDirectory()) {
      return NextResponse.json(
        { error: `分类 ${decodedCategory} 不存在` },
        { status: 404 }
      );
    }

    // 获取侧边栏结构
    const sidebarItems = getDocSidebar(decodedCategory);

    // 添加强缓存控制
    return NextResponse.json(sidebarItems, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, max-age=3600',
        'Vercel-CDN-Cache-Control': 'public, max-age=3600',
        'Surrogate-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Vary': 'Accept-Encoding',
        'ETag': JSON.stringify(sidebarItems).length.toString(),
      }
    });
  } catch (error) {
    console.error(`获取分类 ${params.category} 的侧边栏结构失败:`, error);

    // 出错时返回空数组而不是错误，允许客户端降级
    return NextResponse.json([]);
  }
}
