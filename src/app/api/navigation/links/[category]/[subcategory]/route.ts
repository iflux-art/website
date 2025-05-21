import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 获取特定子分类的链接
 */
export async function GET(
  request: Request,
  { params }: { params: { category: string; subcategory: string } }
) {
  const { category, subcategory } = params;

  try {
    // 动态导入子分类数据
    const subcategoryData = await import(`@/data/navigation/${category}/${subcategory}.json`).then(module => module.default);

    return NextResponse.json(subcategoryData);
  } catch (error) {
    console.error(`获取子分类 ${category}/${subcategory} 失败:`, error);
    return NextResponse.json(
      { error: `获取子分类 ${category}/${subcategory} 失败` },
      { status: 404 }
    );
  }
}
