/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import path from 'path';
import type { LinksCategory, LinksItem, LinksData } from '@/types';
import { links } from '@/components/layout/links/links-data';

const CATEGORIES_FILE_PATH = path.join(process.cwd(), 'data', 'links', 'categories.json');
const ITEMS_FILE_PATH = path.join(process.cwd(), 'data', 'links', 'items.json');
/**
 * 确保数据目录存在
 */
function ensureDataDirectory() {
  const dataDir = path.dirname(CATEGORIES_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}
/**
 * 读取分类数据
 * @internal 内部函数，用于底层数据读取操作
 */
function readCategories(): LinksCategory[] {
  if (!fs.existsSync(CATEGORIES_FILE_PATH)) {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }

  try {
    const content = fs.readFileSync(CATEGORIES_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading categories data:', error);
    throw new Error('Failed to read categories data');
  }
}

/**
 * 读取项目数据
 * @internal 内部函数，用于底层数据读取操作
 */
function readItems(): LinksItem[] {
  if (!fs.existsSync(ITEMS_FILE_PATH)) {
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }

  try {
    const content = fs.readFileSync(ITEMS_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading items data:', error);
    throw new Error('Failed to read items data');
  }
}

/**
 * 写入项目数据
 * @internal 内部函数，用于底层数据写入操作
 * @param items - 要写入的导航项数组
 */
function writeItems(items: LinksItem[]): void {
  try {
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing items data:', error);
    throw new Error('Failed to write items data');
  }
}

/**
 * 读取完整导航数据
 */
export function readLinksData(): LinksData {
  return {
    categories: links.categories.map(cat => ({
      ...cat,
      title: cat.name,
      description: cat.description,
      count: links.items.filter(item => item.category === cat.id).length,
    })),
    items: links.items.map(item => ({
      ...item,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  };
}
/**
 * 写入导航数据
 */
export function writeLinksData(data: LinksData): void {
  ensureDataDirectory();

  try {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(data.categories, null, 2), 'utf-8');
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(data.items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing links data:', error);
    throw new Error('Failed to write links data');
  }
}
/**
 * 添加导航项
 */
export function addLinksItem(item: Omit<LinksItem, 'id' | 'createdAt' | 'updatedAt'>): LinksItem {
  // 检查 URL 是否已存在
  const existingItem = links.items.find(existing => existing.url === item.url);
  if (existingItem) {
    throw new Error('URL already exists');
  }

  const newItem = {
    title: item.title,
    description: item.description || '',
    url: item.url,
    icon: item.icon || '',
    iconType: item.iconType || 'image',
    tags: item.tags || [],
    featured: item.featured || false,
    category: item.category,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 添加到内存中的数据
  (links.items as LinksItem[]).push(newItem);

  // 持久化到文件系统
  try {
    updateLinksDataFile();
  } catch (error) {
    // 如果文件写入失败，从内存中移除
    const index = links.items.findIndex(i => i.id === newItem.id);
    if (index > -1) {
      links.items.splice(index, 1);
    }
    throw error;
  }

  return newItem;
}
/**
 * 更新导航项
 */
export function updateLinksItem(id: string, updates: Partial<LinksItem>): LinksItem {
  const itemIndex = links.items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Links item not found');
  }

  // 如果更新 URL，检查是否与其他项目冲突
  if (updates.url && updates.url !== links.items[itemIndex].url) {
    const existingItem = links.items.find(item => item.url === updates.url && item.id !== id);
    if (existingItem) {
      throw new Error('URL already exists');
    }
  }

  const currentItem = links.items[itemIndex];
  const updatedItem = {
    title: updates.title ?? currentItem.title,
    description: updates.description ?? currentItem.description,
    url: updates.url ?? currentItem.url,
    icon: updates.icon ?? currentItem.icon ?? '',
    iconType: updates.iconType ?? currentItem.iconType,
    tags: updates.tags ?? currentItem.tags,
    featured: updates.featured ?? currentItem.featured,
    category: updates.category ?? currentItem.category,
    id, // 确保 ID 不被更改
    createdAt: currentItem.createdAt,
    updatedAt: new Date().toISOString(),
  };

  // 更新内存中的数据
  (links.items as LinksItem[])[itemIndex] = updatedItem;

  // 持久化到文件系统
  updateLinksDataFile();

  return updatedItem;
}
/**
 * 删除导航项
 */
export function deleteLinksItem(id: string): void {
  const itemIndex = links.items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Links item not found');
  }

  // 从内存中删除
  links.items.splice(itemIndex, 1);

  // 持久化到文件系统
  updateLinksDataFile();
}
/**
 * 获取所有分类
 */
export function getCategories(): LinksCategory[] {
  return links.categories.map(cat => ({
    ...cat,
    title: cat.name,
    description: cat.description,
    count: links.items.filter(item => item.category === cat.id).length,
  }));
}
/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  links.items.forEach(item => {
    item.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}
/**
 * 更新 links-data.ts 文件
 * @internal 将内存中的数据写入到源文件
 */
function updateLinksDataFile(): void {
  const linksDataPath = path.join(
    process.cwd(),
    'src',
    'components',
    'layout',
    'links',
    'links-data.ts'
  );

  try {
    // 生成新的文件内容
    const fileContent = `export type CategoryId =
  | 'ai'
  | 'development'
  | 'design'
  | 'audio'
  | 'video'
  | 'office'
  | 'productivity'
  | 'operation'
  | 'profile'
  | 'friends';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  order: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: 'image' | 'emoji';
  tags: string[];
  featured: boolean;
  category: CategoryId;
  createdAt: string;
  updatedAt: string;
}

export const links = {
  categories: ${JSON.stringify(links.categories, null, 4)},

  items: ${JSON.stringify(links.items, null, 4)},
} as { categories: Category[]; items: Item[] };
`;

    fs.writeFileSync(linksDataPath, fileContent, 'utf-8');
  } catch (error) {
    console.error('Error updating links-data.ts:', error);
    throw new Error('Failed to update links data file');
  }
}

/**
 * 生成唯一 ID
 * @internal 用于生成导航项的唯一标识符
 * @returns 基于时间戳和随机数的唯一字符串
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
