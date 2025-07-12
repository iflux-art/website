import fs from "fs/promises";
import path from "path";
import type { LinksItem, LinksCategory } from "@/types";

const filePath = path.join(process.cwd(), "src/data/links/items.json");
const categoriesPath = path.join(
  process.cwd(),
  "src/data/links/categories.json",
);

// 动态读取 links 数据
export async function getLinksData(): Promise<LinksItem[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as LinksItem[];
  } catch (error) {
    console.error("Error reading links data:", error);
    return [];
  }
}

// 写入 links 数据
export async function writeLinksData(items: LinksItem[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing links data:", error);
    throw error;
  }
}

// 获取分类数据
export async function getLinksCategories(): Promise<LinksCategory[]> {
  try {
    const data = await fs.readFile(categoriesPath, "utf-8");
    return JSON.parse(data) as LinksCategory[];
  } catch (error) {
    console.error("Error reading categories data:", error);
    return [];
  }
}
