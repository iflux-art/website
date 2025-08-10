import fs from "fs";
import path from "path";

type CategoryId =
  | "ai"
  | "development"
  | "design"
  | "audio"
  | "video"
  | "office"
  | "productivity"
  | "operation"
  | "profile"
  | "friends";

type LinksItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: "image" | "text";
  tags: string[];
  featured?: boolean;
  category: CategoryId;
  createdAt: string;
  updatedAt: string;
  visits?: number;
  isActive?: boolean;
};

type LinksCategory = {
  id: string;
  name: string;
  description: string;
  order: number;
  icon?: string;
  color?: string;
};

type Category = LinksCategory;
type Item = LinksItem;

const CATEGORIES_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "config",
  "links",
  "categories.json",
);
const CATEGORIES_DIR = path.join(
  process.cwd(),
  "src",
  "config",
  "links",
  "categories",
);

function ensureDataDirectory() {
  if (!fs.existsSync(CATEGORIES_DIR)) {
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }
}

function readCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE_PATH)) {
    fs.writeFileSync(
      CATEGORIES_FILE_PATH,
      JSON.stringify([], null, 2),
      "utf-8",
    );
    return [];
  }

  try {
    const content = fs.readFileSync(CATEGORIES_FILE_PATH, "utf-8");
    return JSON.parse(content);
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
    return JSON.parse(content);
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
  availableCategories.forEach((category) => {
    categorizedItems[category] = [];
  });

  // 分组项目
  items.forEach((item) => {
    if (categorizedItems[item.category]) {
      categorizedItems[item.category].push(item);
    }
  });

  // 写入各分类文件
  Object.entries(categorizedItems).forEach(([category, categoryItems]) => {
    writeCategoryItems(category, categoryItems);
  });
}

export function readLinksData(): { categories: Category[]; items: Item[] } {
  const categories = readCategories().map((cat) => ({
    ...cat,
    title: cat.name,
  }));
  const items = readItems();
  return {
    categories,
    items,
  };
}

export function writeLinksData(data: {
  categories: Category[];
  items: Item[];
}): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(
      CATEGORIES_FILE_PATH,
      JSON.stringify(data.categories, null, 2),
      "utf-8",
    );
    writeItems(data.items);
  } catch (error) {
    console.error("Error writing links data:", error);
    throw new Error("Failed to write links data");
  }
}

export function addLinksItem(
  item: Omit<Item, "id" | "createdAt" | "updatedAt">,
): Item {
  const items = readItems();
  const existingItem = items.find((existing) => existing.url === item.url);
  if (existingItem) {
    throw new Error("URL already exists");
  }

  const newItem: Item = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: item.category as CategoryId,
  };

  items.push(newItem);
  writeItems(items);

  return newItem;
}

export function updateLinksItem(id: string, updates: Partial<Item>): Item {
  const items = readItems();
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new Error("Links item not found");
  }

  if (updates.url && updates.url !== items[itemIndex].url) {
    const existingItem = items.find(
      (item) => item.url === updates.url && item.id !== id,
    );
    if (existingItem) {
      throw new Error("URL already exists");
    }
  }

  const updatedItem: Item = {
    ...items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  items[itemIndex] = updatedItem;
  writeItems(items);

  return updatedItem;
}

export function deleteLinksItem(id: string): void {
  const items = readItems();
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new Error("Links item not found");
  }

  items.splice(itemIndex, 1);
  writeItems(items);
}

export function getCategories(): Category[] {
  const categories = readCategories();
  const items = readItems();
  return categories.map((cat) => ({
    ...cat,
    count: items.filter((item) => item.category === cat.id).length,
  }));
}

export function getAllTags(): string[] {
  const items = readItems();
  const tags = new Set<string>();
  items.forEach((item) => {
    item.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
