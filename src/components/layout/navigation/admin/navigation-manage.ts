/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import path from 'path';
import type { NavigationCategory, NavigationItem } from '@/types/navigation-types';
import type { NavigationData } from '@/types/navigation-types';
import { navigation } from '@/components/layout/navigation/common/navigation-data';

const CATEGORIES_FILE_PATH = path.join(process.cwd(), 'data', 'navigation', 'categories.json');
const ITEMS_FILE_PATH = path.join(process.cwd(), 'data', 'navigation', 'items.json');
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
 * @internal 内部函数，用于底层数据读取操作
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
 * @internal 内部函数，用于底层数据写入操作
 * @param items - 要写入的导航项数组
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
  return {
    categories: navigation.categories,
    items: navigation.items,
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
export function addNavigationItem(
  item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>
): NavigationItem {
  // 检查 URL 是否已存在
  const existingItem = navigation.items.find((existing) => existing.url === item.url);
  if (existingItem) {
    throw new Error('URL already exists');
  }

  const newItem: NavigationItem = {
    ...item,
    id: `item_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newItem;
}
/**
 * 更新导航项
 */
export function updateNavigationItem(id: string, updates: Partial<NavigationItem>): NavigationItem {
  const item = navigation.items.find((item) => item.id === id);
  if (!item) {
    throw new Error('Item not found');
  }

  const updatedItem: NavigationItem = {
    ...item,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return updatedItem;
}
/**
 * 删除导航项
 */
export function deleteNavigationItem(id: string): void {
  const item = navigation.items.find((item) => item.id === id);
  if (!item) {
    throw new Error('Item not found');
  }
}
/**
 * 获取所有分类
 */
export function getCategories(): NavigationCategory[] {
  return navigation.categories;
}
/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  navigation.items.forEach((item) => {
    item.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
/**
/**
 * 生成唯一 ID
 * @internal 用于生成导航项的唯一标识符
 * @returns 基于时间戳和随机数的唯一字符串
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
