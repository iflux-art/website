import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { LinksItemSchema, LinksFormDataSchema } from '@/lib/schemas/links';

const filePath = path.join(process.cwd(), 'src/data/links/items.json');

// 读取全部 items
async function readItems() {
  const data = await fs.readFile(filePath, 'utf-8');
  const items = JSON.parse(data);
  return z.array(LinksItemSchema).parse(items);
}

// 写入全部 items
async function writeItems(items: z.infer<typeof LinksItemSchema>[]) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const items = await readItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error reading links:', error);
    return NextResponse.json(
      {
        error: 'Failed to read items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const validatedFormData = LinksFormDataSchema.parse(formData);
    const items = await readItems();

    if (items.some(item => item.url === validatedFormData.url)) {
      return NextResponse.json({ error: 'URL already exists' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const newItem = LinksItemSchema.parse({
      ...validatedFormData,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    });

    items.push(newItem);
    await writeItems(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding link:', error);
    return NextResponse.json(
      {
        error: 'Failed to add item',
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
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updates = await request.json();
    const validatedUpdates = LinksFormDataSchema.partial().parse(updates);
    const items = await readItems();
    const idx = items.findIndex(item => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 检查 url 是否重复
    if (
      validatedUpdates.url &&
      items.some(item => item.url === validatedUpdates.url && item.id !== id)
    ) {
      return NextResponse.json({ error: 'URL already exists' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const updatedItem = LinksItemSchema.parse({
      ...items[idx],
      ...validatedUpdates,
      updatedAt: now,
    });

    items[idx] = updatedItem;
    await writeItems(items);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating link:', error);
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
    console.error('Error deleting link:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
