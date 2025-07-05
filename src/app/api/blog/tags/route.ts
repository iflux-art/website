import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllTagsWithCount } from '@/lib/content';
import { TagCountSchema } from '@/lib/schemas/blog';

/**
 * 获取所有标签及其计数的 API 路由
 *
 * @returns 所有标签及其计数
 */
export async function GET() {
  try {
    const tagsWithCount = getAllTagsWithCount();
    // 转换为TagCount数组
    const tagCounts = Object.entries(tagsWithCount).map(([tag, count]) => ({
      tag,
      count,
    }));
    // 使用zod验证数据
    const validatedTags = z.array(TagCountSchema).parse(tagCounts);
    return NextResponse.json(validatedTags);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return NextResponse.json(
      {
        error: '获取标签列表失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
