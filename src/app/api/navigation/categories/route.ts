import { NextResponse } from 'next/server';
import navigationCategories from '@/data/navigation/index.json';

export const runtime = 'edge';

/**
 * 获取所有导航分类
 */
export async function GET() {
  try {
    return NextResponse.json(navigationCategories);
  } catch (error) {
    console.error('获取导航分类失败:', error);
    return NextResponse.json(
      { error: '获取导航分类失败' },
      { status: 500 }
    );
  }
}
