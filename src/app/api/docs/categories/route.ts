import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDocCategories } from '@/lib/content';
import { DocCategorySchema } from '@/lib/schemas/doc';

/**
 * 获取所有文档分类的 API 路由
 *
 * @returns 所有文档分类列表
 */
export async function GET() {
  try {
    const categories = getDocCategories();
    // 使用zod验证数据
    const validatedCategories = z.array(DocCategorySchema).parse(categories);
    // 设置缓存控制头，避免浏览器缓存
    return NextResponse.json(validatedCategories, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('获取文档分类列表失败:', error);
    return NextResponse.json(
      {
        error: '获取文档分类列表失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
