import { NextRequest, NextResponse } from 'next/server';
import { 
  readNavigationData, 
  addNavigationItem, 
  updateNavigationItem, 
  deleteNavigationItem,
  getCategories,
  getAllTags 
} from '@/lib/navigation-data';
import { NavigationFormData } from '@/types/navigation';

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
    
    const data = readNavigationData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting navigation data:', error);
    return NextResponse.json(
      { error: 'Failed to get navigation data' },
      { status: 500 }
    );
  }
}

// POST - 添加导航项
export async function POST(request: NextRequest) {
  try {
    const formData: NavigationFormData = await request.json();
    
    // 验证必填字段
    if (!formData.title || !formData.url || !formData.category) {
      return NextResponse.json(
        { error: 'Title, URL, and category are required' },
        { status: 400 }
      );
    }
    
    const newItem = addNavigationItem({
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
    console.error('Error adding navigation item:', error);
    
    if (error instanceof Error && error.message === 'URL already exists') {
      return NextResponse.json(
        { error: 'URL already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add navigation item' },
      { status: 500 }
    );
  }
}

// PUT - 更新导航项
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    const updates = await request.json();
    const updatedItem = updateNavigationItem(id, updates);
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating navigation item:', error);
    
    if (error instanceof Error && error.message === 'Navigation item not found') {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }
    
    if (error instanceof Error && error.message === 'URL already exists') {
      return NextResponse.json(
        { error: 'URL already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

// DELETE - 删除导航项
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    deleteNavigationItem(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    
    if (error instanceof Error && error.message === 'Navigation item not found') {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}
