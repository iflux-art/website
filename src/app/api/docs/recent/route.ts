import { NextResponse } from 'next/server';
import { getRecentDocs } from '@/lib/docs';

/**
 * 获取最近文档的 API 路由
 * 
 * @param request 请求对象
 * @returns 最近文档列表
 */
export async function GET(request: Request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    const docs = getRecentDocs(limit);
    return NextResponse.json(docs);
  } catch (error) {
    console.error('获取最近文档列表失败:', error);
    return NextResponse.json(
      { error: '获取最近文档列表失败' },
      { status: 500 }
    );
  }
}
