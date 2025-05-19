import { NextResponse } from 'next/server';
import { getDocCategories } from '@/lib/docs';

/**
 * 获取所有文档分类的 API 路由
 * 
 * @returns 所有文档分类列表
 */
export async function GET() {
  try {
    const categories = getDocCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('获取文档分类列表失败:', error);
    return NextResponse.json(
      { error: '获取文档分类列表失败' },
      { status: 500 }
    );
  }
}
