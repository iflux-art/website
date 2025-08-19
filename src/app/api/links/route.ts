import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { LinksItem, CategoryId } from '@/features/links/types';
import {
  addItemToCategory,
  updateItem,
  deleteItem,
  checkUrlExists,
} from '@/features/links/lib/categories';

// 定义类型
interface LinksRequestBody {
  title: string;
  description?: string;
  url: string;
  icon?: string;
  iconType?: string;
  tags?: string[];
  featured?: boolean;
  category: string;
}

interface LinksUpdateBody extends LinksRequestBody {
  id?: string;
}

// 获取所有分类文件夹和文件
async function getAllLinksData(): Promise<LinksItem[]> {
  const linksDir = path.join(process.cwd(), 'src/content/links');
  const allItems: LinksItem[] = [];

  try {
    // Reading from directory

    // 读取根目录下的 JSON 文件
    const rootFiles = await fs.readdir(linksDir);
    // Root files

    for (const file of rootFiles) {
      if (file.endsWith('.json')) {
        // Processing root file
        const filePath = path.join(linksDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const items: LinksItem[] = JSON.parse(data) as LinksItem[];
        // Found items
        allItems.push(...items);
      }
    }

    // 读取子文件夹中的 JSON 文件
    const entries = await fs.readdir(linksDir, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory());
    // Directories

    for (const dir of directories) {
      const dirPath = path.join(linksDir, dir.name);
      const files = await fs.readdir(dirPath);
      // Files

      for (const file of files) {
        if (file.endsWith('.json')) {
          // Processing file
          const filePath = path.join(dirPath, file);
          const data = await fs.readFile(filePath, 'utf8');
          const items: LinksItem[] = JSON.parse(data) as LinksItem[];

          // 为每个项目设置正确的分类
          const categoryName = `${dir.name}/${file.replace('.json', '')}` as CategoryId;
          items.forEach((item: LinksItem) => {
            item.category = categoryName;
          });

          // Found items
          allItems.push(...items);
        }
      }
    }

    // Total items found
    return allItems;
  } catch (error) {
    console.error('Error reading links data:', error);
    return [];
  }
}

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function GET() {
  try {
    // Starting to get all links data
    const items = await getAllLinksData();
    // Found items
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in links API:', error);
    return NextResponse.json(
      {
        error: 'Failed to read links data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LinksRequestBody = (await request.json()) as LinksRequestBody;
    const {
      title,
      description,
      url,
      icon,
      iconType,
      tags,
      featured,
      category: categoryString,
    } = body;
    const category = categoryString as CategoryId;

    // 验证必填字段
    if (!title || !url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 检查URL是否已存在
    const urlExists = await checkUrlExists(url);
    if (urlExists) {
      return NextResponse.json({ error: 'URL already exists' }, { status: 400 });
    }

    // 创建新项目
    const newItem: LinksItem = {
      id: generateId(),
      title,
      description: description ?? '',
      url,
      icon: icon ?? '',
      iconType: (iconType ?? 'image') as 'image' | 'text',
      tags: tags ?? [],
      featured: featured ?? false,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 添加到指定分类
    await addItemToCategory(category, newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      {
        error: 'Failed to create item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    const body: LinksUpdateBody = (await request.json()) as LinksUpdateBody;
    const {
      title,
      description,
      url,
      icon,
      iconType,
      tags,
      featured,
      category: categoryString,
    } = body;
    const category = categoryString as CategoryId;

    // 验证必填字段
    if (!title || !url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 检查URL是否已存在（排除当前项目）
    const urlExists = await checkUrlExists(url, id);
    if (urlExists) {
      return NextResponse.json({ error: 'URL already exists' }, { status: 400 });
    }

    // 更新项目
    const updatedItem = await updateItem(id, {
      title,
      description: description ?? '',
      url,
      icon: icon ?? '',
      iconType: (iconType ?? 'image') as 'image' | 'text',
      tags: tags ?? [],
      featured: featured ?? false,
      category,
    });

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      {
        error: 'Failed to update item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    // 删除项目
    const success = await deleteItem(id);

    if (!success) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
