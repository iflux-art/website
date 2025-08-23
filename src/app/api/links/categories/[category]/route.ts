import { type NextRequest, NextResponse } from 'next/server';
import { loadCategoryData } from '@/features/links/lib/categories';
import { promises as fs } from 'fs';
import path from 'path';

// 动态检查分类是否存在
async function categoryExists(category: string): Promise<boolean> {
  const linksDir = path.join(process.cwd(), 'src/content/links');

  try {
    let filePath: string;

    if (category.includes('/')) {
      // 子分类文件
      filePath = path.join(linksDir, `${category}.json`);
    } else {
      // 根级分类文件
      filePath = path.join(linksDir, `${category}.json`);
    }

    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // 动态检查分类是否存在
    const exists = await categoryExists(category);
    if (!exists) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const items = await loadCategoryData(category);
    return NextResponse.json(items);
  } catch (error) {
    console.error(`Error reading category:`, error);
    return NextResponse.json(
      {
        error: 'Failed to read category data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
