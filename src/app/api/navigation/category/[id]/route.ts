import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 获取特定分类的信息
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 动态导入分类数据
    const categoryData = await import(`@/data/navigation/${id}/index.json`).then(module => module.default);

    return NextResponse.json(categoryData);
  } catch (error) {
    console.error(`获取分类 ${id} 失败:`, error);
    return NextResponse.json(
      { error: `获取分类 ${id} 失败` },
      { status: 404 }
    );
  }
}
