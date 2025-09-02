import { promises as fs } from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

// 动态检查分类是否存在
async function categoryExists(category: string): Promise<boolean> {
  const linksDir = path.join(process.cwd(), "src/content/links");

  try {
    let filePath: string;

    if (category.includes("/")) {
      // 子分类文件
      filePath = path.join(linksDir, `${category}.json`);
    } else {
      // 根级分类文件
      filePath = path.join(linksDir, `${category}.json`);
    }

    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // 动态检查分类是否存在
    const exists = await categoryExists(category);
    if (!exists) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // 构建文件路径
    const filePath = path.join(process.cwd(), "src/content/links", `${category}.json`);

    // 读取并解析JSON文件
    const fileContent = await fs.readFile(filePath, "utf8");
    const items = JSON.parse(fileContent);

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error reading category:", error);
    return NextResponse.json(
      {
        error: "Failed to read category data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
