import { NextRequest, NextResponse } from 'next/server';
import { linksService } from '@/lib/links-service';
import { LinksFormData } from '@/types';

// GET - 获取导航数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'categories') {
      const categories = await linksService.getCategories();
      return NextResponse.json(categories);
    }

    if (type === 'tags') {
      const tags = await linksService.getAllTags();
      return NextResponse.json(tags);
    }

    const data = await linksService.getData();
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

    // 使用服务层验证
    const validation = linksService.validateLinkData(formData);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const newItem = await linksService.addLink({
      title: formData.title,
      description: formData.description || '',
      url: formData.url,
      icon: formData.icon || '',
      iconType: formData.iconType || 'image',
      tags: formData.tags || [],
      featured: formData.featured || false,
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
    const updatedItem = await linksService.updateLink(id, updates);

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

    await linksService.deleteLink(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting links item:', error);

    if (error instanceof Error && error.message === 'Links item not found') {
      return NextResponse.json({ error: 'Links item not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete links item' }, { status: 500 });
  }
}
