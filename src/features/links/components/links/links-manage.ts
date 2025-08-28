/**
 * Links 数据管理模块
 *
 * 提供链接数据的 CRUD 操作，包括：
 * - 读取和写入分类数据
 * - 管理链接项目的增删改查
 * - 处理分类统计和标签管理
 *
 * 数据存储结构：
 * - 分类数据：src/config/links/categories.json
 * - 链接数据：src/config/links/categories/{category}.json
 *
 * @author 系统重构
 * @since 2024
 */

import fs from "node:fs";
import path from "node:path";
import type { LinksCategory, LinksItem } from "@/features/links/types";

type Category = LinksCategory;
type Item = LinksItem;

const CATEGORIES_FILE_PATH = path.join(process.cwd(), "src", "config", "links", "categories.json");
const CATEGORIES_DIR = path.join(process.cwd(), "src", "config", "links", "categories");

function ensureDataDirectory() {
  if (!fs.existsSync(CATEGORIES_DIR)) {
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }
}

function readCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE_PATH)) {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
    return [];
  }

  try {
    const content = fs.readFileSync(CATEGORIES_FILE_PATH, "utf-8");
    return JSON.parse(content) as Category[];
  } catch (error) {
    console.error("Error reading categories data:", error);
    throw new Error("Failed to read categories data");
  }
}

const availableCategories = [
  "friends",
  "ai",
  "ai-chat",
  "development",
  "design",
  "productivity",
  "profile",
  "operation",
  "office",
  "audio",
  "video",
];

function readCategoryItems(category: string): Item[] {
  const categoryFile = path.join(CATEGORIES_DIR, `${category}.json`);
  if (!fs.existsSync(categoryFile)) {
    return [];
  }

  try {
    const content = fs.readFileSync(categoryFile, "utf-8");
    return JSON.parse(content) as Item[];
  } catch (error) {
    console.error(`Error reading category ${category}:`, error);
    return [];
  }
}

function writeCategoryItems(category: string, items: Item[]): void {
  try {
    const categoryFile = path.join(CATEGORIES_DIR, `${category}.json`);
    fs.writeFileSync(categoryFile, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing category ${category}:`, error);
    throw new Error(`Failed to write category ${category} data`);
  }
}

function readItems(): Item[] {
  const allItems: Item[] = [];

  for (const category of availableCategories) {
    const categoryItems = readCategoryItems(category);
    allItems.push(...categoryItems);
  }

  return allItems;
}

function writeItems(items: Item[]): void {
  // 按分类分组
  const categorizedItems: { [key: string]: Item[] } = {};

  // 初始化所有分类
  availableCategories.forEach(category => {
    categorizedItems[category] = [];
  });

  // 分组项目
  items.forEach(item => {
    // 添加更严格的空值检查
    if (item.category && Object.hasOwn(categorizedItems, item.category)) {
      // 确保 categorizedItems[item.category] 存在且不为 undefined
      const categoryArray = categorizedItems[item.category];
      if (categoryArray) {
        categoryArray.push(item);
      }
    }
  });

  // 写入各分类文件
  Object.entries(categorizedItems).forEach(([category, categoryItems]) => {
    writeCategoryItems(category, categoryItems);
  });
}

/**
 * 读取所有链接数据
 *
 * @returns 包含分类和链接项目的完整数据结构
 */
export function readLinksData(): { categories: Category[]; items: Item[] } {
  const categories = readCategories().map(cat => ({
    ...cat,
    title: cat.name,
  }));
  const items = readItems();
  return {
    categories,
    items,
  };
}

export function writeLinksData(data: { categories: Category[]; items: Item[] }): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(data.categories, null, 2), "utf-8");
    writeItems(data.items);
  } catch (error) {
    console.error("Error writing links data:", error);
    throw new Error("Failed to write links data");
  }
}

/**
 * 添加新的链接项目
 *
 * @param item - 链接项目数据（不包含 id、创建时间和更新时间）
 * @returns 创建的完整链接项目
 * @throws {Error} 当 URL 已存在时抛出错误
 */
export function addLinksItem(item: Omit<Item, "id" | "createdAt" | "updatedAt">): Item {
  const items = readItems();
  const existingItem = items.find(existing => existing.url === item.url);
  if (existingItem) {
    throw new Error("URL already exists");
  }

  const newItem: Item = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: item.category,
  };

  items.push(newItem);
  writeItems(items);

  return newItem;
}

/**
 * 更新链接项目
 *
 * @param id - 链接项目 ID
 * @param updates - 要更新的字段
 * @returns 更新后的链接项目
 * @throws {Error} 当项目不存在或 URL 冲突时抛出错误
 */
export function updateLinksItem(id: string, updates: Partial<Item>): Item {
  const items = readItems();
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error("Links item not found");
  }

  // 添加边界检查
  if (itemIndex >= 0 && itemIndex < items.length && items[itemIndex]) {
    // 添加空值检查
    if (updates.url && items[itemIndex] && updates.url !== items[itemIndex].url) {
      const existingItem = items.find(item => item.url === updates.url && item.id !== id);
      if (existingItem) {
        throw new Error("URL already exists");
      }
    }

    const updatedItem: Item = {
      // 从 items[itemIndex] 中提取所有属性，然后覆盖需要更新的属性
      ...items[itemIndex],
      ...updates,
      // 确保必要的属性有默认值
      id: items[itemIndex]?.id ?? "",
      title: items[itemIndex]?.title ?? "",
      description: items[itemIndex]?.description ?? "",
      url: items[itemIndex]?.url ?? "",
      icon: items[itemIndex]?.icon ?? "",
      iconType: items[itemIndex]?.iconType,
      tags: items[itemIndex]?.tags ?? [],
      featured: items[itemIndex]?.featured ?? false,
      category: items[itemIndex]?.category ?? "development",
      createdAt: items[itemIndex]?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items[itemIndex] = updatedItem;
    writeItems(items);

    return updatedItem;
  }

  throw new Error("Links item not found");
}

/**
 * 删除链接项目
 *
 * @param id - 要删除的链接项目 ID
 * @throws {Error} 当项目不存在时抛出错误
 */
export function deleteLinksItem(id: string): void {
  const items = readItems();
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error("Links item not found");
  }

  items.splice(itemIndex, 1);
  writeItems(items);
}

export function getCategories(): Category[] {
  const categories = readCategories();
  const items = readItems();
  return categories.map(cat => ({
    ...cat,
    count: items.filter(item => item.category && item.category === cat.id).length,
  }));
}

export function getAllTags(): string[] {
  const items = readItems();
  const tags = new Set<string>();
  items.forEach(item => {
    // 添加空值检查
    if (item.tags) {
      item.tags.forEach(tag => {
        tags.add(tag);
      });
    }
  });
  return Array.from(tags).sort();
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
