import fs from 'fs';
import path from 'path';
import { NavigationData, NavigationItem, NavigationCategory } from '@/types/navigation';

const CATEGORIES_FILE_PATH = path.join(process.cwd(), 'src', 'content', 'data', 'categories.json');
const ITEMS_FILE_PATH = path.join(process.cwd(), 'src', 'content', 'data', 'items.json');
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
 */
function readCategories(): NavigationCategory[] {
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
 */
function readItems(): NavigationItem[] {
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
 */
function writeItems(items: NavigationItem[]): void {
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
export function readNavigationData(): NavigationData {
  ensureDataDirectory();
  return {
    categories: readCategories(),
    items: readItems(),
  };
}
/**
 * 写入导航数据
 */
export function writeNavigationData(data: NavigationData): void {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(data.categories, null, 2), 'utf-8');
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(data.items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing navigation data:', error);
    throw new Error('Failed to write navigation data');
  }
}
/**
 * 添加导航项 
 */
export function addNavigationItem(item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>): NavigationItem {
  const items = readItems();

  // 检查 URL 是否已存在
  const existingItem = items.find(existing => existing.url === item.url);
  if (existingItem) {
    throw new Error('URL already exists');
  }

  const newItem: NavigationItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeItems(items);

  return newItem;
}
/**
 * 更新导航项
 */
export function updateNavigationItem(id: string, updates: Partial<Omit<NavigationItem, 'id' | 'createdAt'>>): NavigationItem {
  const items = readItems();

  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Navigation item not found');
  }

  // 如果更新 URL，检查是否与其他项冲突
  if (updates.url && updates.url !== items[itemIndex].url) {
    const existingItem = items.find(existing => existing.url === updates.url && existing.id !== id);
    if (existingItem) {
      throw new Error('URL already exists');
    }
  }

  const updatedItem: NavigationItem = {
    ...items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  items[itemIndex] = updatedItem;
  writeItems(items);

  return updatedItem;
}
/**
 * 删除导航项
 */
export function deleteNavigationItem(id: string): void {
  const items = readItems();

  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Navigation item not found');
  }

  items.splice(itemIndex, 1);
  writeItems(items);
}
/**
 * 获取所有分类
 */
export function getCategories(): NavigationCategory[] {
  const categories = readCategories();
  return categories.sort((a, b) => a.order - b.order);
}
/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const items = readItems();
  const tagSet = new Set<string>();

  items.forEach(item => {
    item.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
/**
 * 生成唯一 ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}