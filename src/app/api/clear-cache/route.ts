import { NextResponse } from 'next/server';
import { clearApiCache } from '@/lib/api-cache';

/**
 * 清除 API 缓存的路由
 *
 * @returns 清除缓存的结果
 */
export async function GET() {
  try {
    // 清除所有 API 缓存
    clearApiCache();

    console.log('已清除所有 API 缓存');

    return NextResponse.json({ success: true, message: '已清除所有 API 缓存' });
  } catch (error) {
    console.error('清除 API 缓存失败:', error);
    return NextResponse.json({ success: false, error: '清除 API 缓存失败' }, { status: 500 });
  }
}
