import { NextResponse } from 'next/server';
import { type Dirent, promises as fs } from 'fs';
import type { LinksItem } from '@/features/links/types';
import path from 'path';

interface Category {
  id: string;
  name: string;
  count: number;
  children?: Category[];
}

/**
 * 处理根目录下的JSON文件
 */
async function processRootFiles(linksDir: string, categories: Category[]): Promise<void> {
  const rootFiles = await fs.readdir(linksDir);
  for (const file of rootFiles) {
    if (file.endsWith('.json') && file !== 'index.js') {
      const categoryId = file.replace('.json', '');
      const filePath = path.join(linksDir, file);
      const data = await fs.readFile(filePath, 'utf8');
      const items: unknown[] = JSON.parse(data) as unknown[];

      categories.push({
        id: categoryId,
        name: getCategoryDisplayName(categoryId),
        count: items.length,
        children: [],
      });
    }
  }
}

/**
 * 处理单个子目录
 */
async function processSubdirectory(dir: Dirent, linksDir: string): Promise<Category | null> {
  const dirPath = path.join(linksDir, dir.name);
  const files = await fs.readdir(dirPath);
  const children: Category[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const subcategoryId = file.replace('.json', '');
      const filePath = path.join(dirPath, file);
      const data = await fs.readFile(filePath, 'utf8');
      const items = JSON.parse(data) as LinksItem[];

      children.push({
        id: `${dir.name}/${subcategoryId}`,
        name: getCategoryDisplayName(subcategoryId),
        count: items.length,
      });
    }
  }

  if (children.length > 0) {
    const totalCount = children.reduce((sum, child) => sum + child.count, 0);
    return {
      id: dir.name,
      name: getCategoryDisplayName(dir.name),
      count: totalCount,
      children,
    };
  }

  return null;
}

/**
 * 处理子文件夹中的分类
 */
async function processSubdirectories(linksDir: string, categories: Category[]): Promise<void> {
  const entries = await fs.readdir(linksDir, { withFileTypes: true });
  const directories = entries.filter(entry => entry.isDirectory());

  for (const dir of directories) {
    const category = await processSubdirectory(dir, linksDir);
    if (category) {
      categories.push(category);
    }
  }
}

// 生成分类数据基于文件夹结构
async function generateCategoriesFromFiles() {
  const linksDir = path.join(process.cwd(), 'src/content/links');
  const categories: Category[] = [];

  try {
    // 读取根目录下的 JSON 文件（如 profile.json, friends.json）
    await processRootFiles(linksDir, categories);

    // 读取子文件夹中的分类
    await processSubdirectories(linksDir, categories);

    return categories;
  } catch (error) {
    console.error('Error generating categories:', error);
    return [];
  }
}

/**
 * 分类显示名称配置
 */
const CATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  // 根级分类
  profile: '个人主页',
  friends: '友情链接',

  // 主分类
  ai: 'AI 工具',
  audio: '音频处理',
  design: '设计工具',
  development: '开发工具',
  office: '办公软件',
  operation: '运营工具',
  productivity: '效率工具',
  video: '视频处理',

  // AI 子分类
  chat: 'AI 对话',
  models: 'AI 模型',
  tools: '工具平台',
  platforms: '综合平台',
  api: 'API 服务',
  services: '在线服务',
  creative: '创意工具',
  resources: '学习资源',

  // 音频子分类
  daw: '数字音频工作站',
  processing: '音频处理',
  distribution: '音乐发行',

  // 设计子分类
  fonts: '字体资源',
  colors: '配色工具',
  'image-processing': '图像处理',

  // 开发子分类
  frameworks: '开发框架',

  // 办公子分类
  documents: '文档处理',
  notes: '笔记工具',
  mindmaps: '思维导图',
  presentation: '演示文稿',
  pdf: 'PDF 工具',
  ocr: 'OCR 识别',

  // 运营子分类
  'social-media': '社交媒体',
  'video-platforms': '视频平台',
  ecommerce: '电商工具',
  marketing: '营销工具',

  // 效率子分类
  search: '搜索引擎',
  browsers: '浏览器',
  'cloud-storage': '云存储',
  email: '邮箱服务',
  translation: '翻译工具',
  'system-tools': '系统工具',

  // 视频子分类
  editing: '视频编辑',
};

/**
 * 获取分类显示名称
 */
function getCategoryDisplayName(categoryId: string): string {
  return CATEGORY_DISPLAY_NAMES[categoryId] || categoryId;
}

export async function GET() {
  try {
    const categories = await generateCategoriesFromFiles();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error reading links categories:', error);
    return NextResponse.json(
      {
        error: 'Failed to read categories',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
