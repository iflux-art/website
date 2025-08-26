import { promises as fs } from "node:fs";
import path from "node:path";
import type { CategoryId, LinksItem } from "@/features/links/types";

const linksDir = path.join(process.cwd(), "src/content/links");

// 动态获取所有分类
async function getAllCategories(): Promise<string[]> {
  const categories: string[] = [];

  try {
    // 读取根目录下的 JSON 文件
    const rootFiles = await fs.readdir(linksDir);
    rootFiles
      .filter(file => file.endsWith(".json"))
      .forEach(file => {
        categories.push(file.replace(".json", ""));
      });

    // 读取子文件夹中的 JSON 文件
    const entries = await fs.readdir(linksDir, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory());

    // 使用 Promise.all 并行处理所有目录
    const processPromises = directories.map(dir => {
      if (dir.name === "category") {
        // 处理 category 子目录
        return processCategoryDirectory(linksDir, dir.name, categories);
      } else {
        // 处理其他直接子目录（向后兼容）
        return processOtherDirectory(linksDir, dir.name, categories);
      }
    });

    await Promise.all(processPromises);

    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

// 处理 category 子目录
async function processCategoryDirectory(
  linksDir: string,
  categoryName: string,
  categories: string[]
): Promise<void> {
  const categoryDirPath = path.join(linksDir, categoryName);
  const categoryEntries = await fs.readdir(categoryDirPath, { withFileTypes: true });
  const categoryDirs = categoryEntries.filter(entry => entry.isDirectory());

  // 使用 Promise.all 并行处理所有子目录
  const processPromises = categoryDirs.map(async categoryDir => {
    const subDirPath = path.join(categoryDirPath, categoryDir.name);
    const files = await fs.readdir(subDirPath);

    // 处理文件 - 使用展开运算符和filter/map链
    categories.push(
      ...files
        .filter(file => file.endsWith(".json"))
        .map(file => `${categoryDir.name}/${file.replace(".json", "")}`)
    );
  });

  await Promise.all(processPromises);
}

// 处理其他直接子目录（向后兼容）
async function processOtherDirectory(
  linksDir: string,
  dirName: string,
  categories: string[]
): Promise<void> {
  const dirPath = path.join(linksDir, dirName);
  const files = await fs.readdir(dirPath);

  // 处理文件 - 使用展开运算符和filter/map链
  categories.push(
    ...files
      .filter(file => file.endsWith(".json"))
      .map(file => `${dirName}/${file.replace(".json", "")}`)
  );
}

// 读取单个分类数据
export async function loadCategoryData(category: string): Promise<LinksItem[]> {
  try {
    let filePath: string;

    if (category.includes("/")) {
      // 子分类文件 - 正确构建路径
      const parts = category.split("/");
      if (parts.length === 2) {
        filePath = path.join(linksDir, "category", parts[0], `${parts[1]}.json`);
      } else {
        // 向后兼容旧的路径结构
        filePath = path.join(linksDir, `${category}.json`);
      }
    } else {
      // 根级分类文件
      filePath = path.join(linksDir, `${category}.json`);
    }

    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as LinksItem[];
  } catch (error) {
    console.error(`Error loading category ${category}:`, error);
    return [];
  }
}

// 保存单个分类数据
export async function saveCategoryData(category: string, data: LinksItem[]): Promise<void> {
  try {
    let filePath: string;

    if (category.includes("/")) {
      // 子分类文件 - 正确构建路径
      const parts = category.split("/");
      if (parts.length === 2) {
        filePath = path.join(linksDir, "category", parts[0], `${parts[1]}.json`);
      } else {
        // 向后兼容旧的路径结构
        filePath = path.join(linksDir, `${category}.json`);
      }
    } else {
      // 根级分类文件
      filePath = path.join(linksDir, `${category}.json`);
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error saving category ${category}:`, error);
    throw new Error(`Failed to save category ${category}`);
  }
}

// 读取所有分类数据
export async function loadAllCategoriesData(): Promise<LinksItem[]> {
  const allItems: LinksItem[] = [];
  const allCategories = await getAllCategories();

  // 使用 Promise.all 并行处理所有分类
  const categoryPromises = allCategories.map(async category => {
    const categoryData = await loadCategoryData(category);
    // 确保每个项目都有正确的分类标识
    categoryData.forEach(item => {
      item.category = category as CategoryId;
    });
    return categoryData;
  });

  const results = await Promise.all(categoryPromises);
  results.forEach(data => {
    allItems.push(...data);
  });

  return allItems;
}

// 根据ID查找项目及其所在分类
export async function findItemById(
  id: string
): Promise<{ item: LinksItem; category: string } | null> {
  const allCategories = await getAllCategories();

  // 使用 Promise.all 并行查找所有分类
  const searchPromises = allCategories.map(async category => {
    const categoryData = await loadCategoryData(category);
    const item = categoryData.find(item => item.id === id);
    return item ? { item, category } : null;
  });

  const results = await Promise.all(searchPromises);
  return results.find(result => result !== null) || null;
}

// 添加新项目到指定分类
export async function addItemToCategory(category: string, item: LinksItem): Promise<void> {
  const categoryData = await loadCategoryData(category);
  categoryData.push(item);
  await saveCategoryData(category, categoryData);
}

// 更新项目
export async function updateItem(
  id: string,
  updates: Partial<LinksItem>
): Promise<LinksItem | null> {
  const result = await findItemById(id);
  if (!result) return null;

  const { item, category } = result;
  const categoryData = await loadCategoryData(category);
  const itemIndex = categoryData.findIndex(i => i.id === id);

  if (itemIndex === -1) return null;

  const updatedItem = {
    ...item,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  categoryData[itemIndex] = updatedItem;

  // 如果分类发生变化，需要移动项目
  if (updates.category && updates.category !== category) {
    // 从原分类中删除
    categoryData.splice(itemIndex, 1);
    await saveCategoryData(category, categoryData);

    // 添加到新分类
    await addItemToCategory(updates.category, updatedItem);
  } else {
    await saveCategoryData(category, categoryData);
  }

  return updatedItem;
}

// 删除项目
export async function deleteItem(id: string): Promise<boolean> {
  const result = await findItemById(id);
  if (!result) return false;

  const { category } = result;
  const categoryData = await loadCategoryData(category);
  const itemIndex = categoryData.findIndex(i => i.id === id);

  if (itemIndex === -1) return false;

  categoryData.splice(itemIndex, 1);
  await saveCategoryData(category, categoryData);

  return true;
}

// 检查URL是否已存在
export async function checkUrlExists(url: string, excludeId?: string): Promise<boolean> {
  const allCategories = await getAllCategories();

  // 使用 Promise.all 并行检查所有分类
  const checkPromises = allCategories.map(async category => {
    const categoryData = await loadCategoryData(category);
    return categoryData.some(item => item.url === url && item.id !== excludeId);
  });

  const results = await Promise.all(checkPromises);
  return results.some(exists => exists);
}
