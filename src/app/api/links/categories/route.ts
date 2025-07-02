import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/links/categories.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const categories = JSON.parse(data);
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to read categories' }, { status: 500 });
  }
}
