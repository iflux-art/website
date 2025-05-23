import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/content';

/**
 * 获取所有标签的 API 路由
 *
 * @returns 所有标签列表
 */
export async function GET() {
  try {
    const tags = getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return NextResponse.json({ error: '获取标签列表失败' }, { status: 500 });
  }
}
