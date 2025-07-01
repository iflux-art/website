import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type { LinksItem, LinksFormData } from '@/types/links-types';

const filePath = path.join(process.cwd(), 'src/data/links/items.json');

// 读取全部 items
async function readItems(): Promise<LinksItem[]> {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// 写入全部 items
async function writeItems(items: LinksItem[]) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const items = await readItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to read items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: LinksFormData = await request.json();
    const items = await readItems();
    if (items.some(item => item.url === formData.url)) {
      return NextResponse.json({ error: 'URL already exists' }, { status: 409 });
    }
    const now = new Date().toISOString();
    const newItem: LinksItem = {
      ...formData,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    await writeItems(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const updates: Partial<LinksFormData> = await request.json();
    const items = await readItems();
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    // 检查 url 是否重复
    if (updates.url && items.some(item => item.url === updates.url && item.id !== id)) {
      return NextResponse.json({ error: 'URL already exists' }, { status: 409 });
    }
    const now = new Date().toISOString();
    const updatedItem: LinksItem = {
      ...items[idx],
      ...updates,
      updatedAt: now,
    };
    items[idx] = updatedItem;
    await writeItems(items);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const items = await readItems();
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    items.splice(idx, 1);
    await writeItems(items);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
