import fs from 'fs';
import path from 'path';
import { NavigationData, NavigationItem, NavigationCategory } from '@/types/navigation';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'content', 'data', 'navigation.json');

/**
 * 确保数据目录存在
 */
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * 读取导航数据
 */
export function readNavigationData(): NavigationData {
  ensureDataDirectory();
  
  if (!fs.existsSync(DATA_FILE_PATH)) {
    // 创建默认数据文件
    const defaultData: NavigationData = {
      categories: [
        { id: 'development', name: '开发工具', description: '编程开发相关工具和资源', order: 1 },
        { id: 'design', name: '设计资源', description: '设计工具和素材资源', order: 2 },
        { id: 'productivity', name: '效率工具', description: '提升工作效率的工具', order: 3 },
        { id: 'learning', name: '学习资源', description: '在线学习和教育资源', order: 4 },
        { id: 'entertainment', name: '娱乐休闲', description: '娱乐和休闲网站', order: 5 },
      ],
      items: [],
    };
    
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  
  try {
    const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading navigation data:', error);
    throw new Error('Failed to read navigation data');
  }
}

/**
 * 写入导航数据
 */
export function writeNavigationData(data: NavigationData): void {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing navigation data:', error);
    throw new Error('Failed to write navigation data');
  }
}

/**
 * 添加导航项
 */
export function addNavigationItem(item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>): NavigationItem {
  const data = readNavigationData();
  
  // 检查 URL 是否已存在
  const existingItem = data.items.find(existing => existing.url === item.url);
  if (existingItem) {
    throw new Error('URL already exists');
  }
  
  const newItem: NavigationItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  data.items.push(newItem);
  writeNavigationData(data);
  
  return newItem;
}

/**
 * 更新导航项
 */
export function updateNavigationItem(id: string, updates: Partial<Omit<NavigationItem, 'id' | 'createdAt'>>): NavigationItem {
  const data = readNavigationData();
  
  const itemIndex = data.items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Navigation item not found');
  }
  
  // 如果更新 URL，检查是否与其他项冲突
  if (updates.url && updates.url !== data.items[itemIndex].url) {
    const existingItem = data.items.find(existing => existing.url === updates.url && existing.id !== id);
    if (existingItem) {
      throw new Error('URL already exists');
    }
  }
  
  const updatedItem: NavigationItem = {
    ...data.items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  data.items[itemIndex] = updatedItem;
  writeNavigationData(data);
  
  return updatedItem;
}

/**
 * 删除导航项
 */
export function deleteNavigationItem(id: string): void {
  const data = readNavigationData();
  
  const itemIndex = data.items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Navigation item not found');
  }
  
  data.items.splice(itemIndex, 1);
  writeNavigationData(data);
}

/**
 * 获取所有分类
 */
export function getCategories(): NavigationCategory[] {
  const data = readNavigationData();
  return data.categories.sort((a, b) => a.order - b.order);
}

/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const data = readNavigationData();
  const tagSet = new Set<string>();
  
  data.items.forEach(item => {
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