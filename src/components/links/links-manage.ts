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
  "data",
  "links",
  "categories.json",
);
const ITEMS_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "links",
  "items.json",
);

function ensureDataDirectory() {
  const dataDir = path.dirname(CATEGORIES_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
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

function readItems(): Item[] {
  if (!fs.existsSync(ITEMS_FILE_PATH)) {
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
    return [];
  }

  try {
    const content = fs.readFileSync(ITEMS_FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading items data:", error);
    throw new Error("Failed to read items data");
  }
}

function writeItems(items: Item[]): void {
  try {
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing items data:", error);
    throw new Error("Failed to write items data");
  }
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
    fs.writeFileSync(
      ITEMS_FILE_PATH,
      JSON.stringify(data.items, null, 2),
      "utf-8",
    );
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
