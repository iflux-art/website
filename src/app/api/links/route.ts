import { NextRequest, NextResponse } from 'next/server';
import {
  readLinksData,
  addLinksItem,
  updateLinksItem,
  deleteLinksItem,
  getCategories,
  getAllTags,
} from '@/components/layout/links/admin/links-manage';
import { LinksFormData } from '@/types/links-types';

// GET - 获取导航数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'categories') {
      const categories = getCategories();
      return NextResponse.json(categories);
    }

    if (type === 'tags') {
      const tags = getAllTags();
      return NextResponse.json(tags);
    }

    const data = readLinksData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting links data:', error);
    return NextResponse.json({ error: 'Failed to get links data' }, { status: 500 });
  }
}

// POST - 添加导航项
export async function POST(request: NextRequest) {
  try {
    const formData: LinksFormData = await request.json();

    // 验证必填字段
    if (!formData.title || !formData.url || !formData.category) {
      return NextResponse.json({ error: 'Title, URL, and category are required' }, { status: 400 });
    }

    const newItem = addLinksItem({
      title: formData.title,
      description: formData.description,
      url: formData.url,
      icon: formData.icon,
      iconType: formData.iconType,
      tags: formData.tags,
      featured: formData.featured,
      category: formData.category,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding links item:', error);

    if (error instanceof Error && error.message === 'URL already exists') {
      return NextResponse.json({ error: 'URL already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to add links item' }, { status: 500 });
  }
}

// PUT - 更新导航项
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updates = await request.json();
    const updatedItem = updateLinksItem(id, updates);

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating links item:', error);

    if (error instanceof Error && error.message === 'Links item not found') {
      return NextResponse.json({ error: 'Links item not found' }, { status: 404 });
    }

    if (error instanceof Error && error.message === 'URL already exists') {
      return NextResponse.json({ error: 'URL already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to update links item' }, { status: 500 });
  }
}

// DELETE - 删除导航项
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    deleteLinksItem(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting links item:', error);

    if (error instanceof Error && error.message === 'Links item not found') {
      return NextResponse.json({ error: 'Links item not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete links item' }, { status: 500 });
  }
}
