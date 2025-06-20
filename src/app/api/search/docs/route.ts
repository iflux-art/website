import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface Doc {
  title: string;
  description: string;
  content: string;
  url: string;
  category: string;
}
// 递归读取目录下的所有 .md 和 .mdx 文件
async function getAllFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dirPath, entry.name);
      return entry.isDirectory() ? getAllFiles(res) : res;
    })
  );
  return files.flat().filter((file) => /\.(md|mdx)$/.test(file));
}

// 读取文档内容
async function getDocs(): Promise<Doc[]> {
  const docsDir = path.join(process.cwd(), 'src/content/docs');
  const files = await getAllFiles(docsDir);

  const docs = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, 'utf-8');
      const { data, content: markdown } = matter(content);
      const relativePath = path.relative(docsDir, file);
      const url = `/docs/${relativePath.replace(/\.(md|mdx)$/, '')}`;

      return {
        title: data.title || '',
        description: data.description || '',
        content: markdown,
        url,
        category: data.category || '',
      };
    })
  );

  return docs;
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const docs = await getDocs();
    const searchResults = docs
      .filter((doc) => {
        const searchContent = `${doc.title} ${doc.description} ${doc.content}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
      })
      .map((doc) => ({
        title: doc.title,
        path: doc.url,
        excerpt: doc.description || doc.content.slice(0, 160) + '...',
      }));

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error searching docs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
