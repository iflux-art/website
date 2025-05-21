import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const { category } = await Promise.resolve(params);

  try {
    // 使用动态导入获取分类数据
    const categoryData = await import(`@/data/navigation/${category}/index.json`).then(module => module.default);

    // 准备结果对象
    const result = {
      category: categoryData,
      subcategories: []
    };

    // 添加调试日志
    console.log(`分类 ${category} 的子分类数量:`, categoryData.subcategories.length);

    // 获取所有子分类数据
    for (const subcategory of categoryData.subcategories) {
      try {
        console.log(`尝试导入子分类:`, subcategory.id);

        // 使用动态导入获取子分类数据
        const subcategoryData = await import(`@/data/navigation/${category}/${subcategory.id}.json`).then(module => module.default);
        console.log(`子分类 ${subcategory.id} 的链接数量:`, subcategoryData.links?.length || 0);

        result.subcategories.push(subcategoryData);
      } catch (err) {
        console.error(`导入子分类 ${subcategory.id} 数据失败:`, err);
      }
    }

    console.log(`返回的子分类数量:`, result.subcategories.length);
    console.log(`返回的链接总数:`, result.subcategories.reduce((total, sub) => total + (sub.links?.length || 0), 0));

    return NextResponse.json(result);
  } catch (err) {
    console.error(`读取分类 ${category} 数据失败:`, err);
    return NextResponse.json({ error: `无法加载 ${category} 分类数据` }, { status: 404 });
  }
}

// 添加 Edge Runtime 配置
export const runtime = 'edge';
