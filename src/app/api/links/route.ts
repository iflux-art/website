import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LinksItem } from "@/features/links/types";
import {
  addItemToCategory,
  updateItem,
  deleteItem,
  checkUrlExists,
} from "@/features/links/lib/categories";

// 获取所有分类文件夹和文件
async function getAllLinksData(): Promise<LinksItem[]> {
  const linksDir = path.join(process.cwd(), "src/content/links");
  const allItems: LinksItem[] = [];

  try {
    console.log("Reading from directory:", linksDir);

    // 读取根目录下的 JSON 文件
    const rootFiles = await fs.readdir(linksDir);
    console.log("Root files:", rootFiles);

    for (const file of rootFiles) {
      if (file.endsWith(".json")) {
        console.log("Processing root file:", file);
        const filePath = path.join(linksDir, file);
        const data = await fs.readFile(filePath, "utf8");
        const items = JSON.parse(data);
        console.log(`Found ${items.length} items in ${file}`);
        allItems.push(...items);
      }
    }

    // 读取子文件夹中的 JSON 文件
    const entries = await fs.readdir(linksDir, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory());
    console.log(
      "Directories:",
      directories.map((d) => d.name),
    );

    for (const dir of directories) {
      const dirPath = path.join(linksDir, dir.name);
      const files = await fs.readdir(dirPath);
      console.log(`Files in ${dir.name}:`, files);

      for (const file of files) {
        if (file.endsWith(".json")) {
          console.log(`Processing ${dir.name}/${file}`);
          const filePath = path.join(dirPath, file);
          const data = await fs.readFile(filePath, "utf8");
          const items = JSON.parse(data);

          // 为每个项目设置正确的分类
          const categoryName =
            `${dir.name}/${file.replace(".json", "")}` as any;
          items.forEach((item: LinksItem) => {
            item.category = categoryName;
          });

          console.log(`Found ${items.length} items in ${categoryName}`);
          allItems.push(...items);
        }
      }
    }

    console.log("Total items found:", allItems.length);
    return allItems;
  } catch (error) {
    console.error("Error reading links data:", error);
    return [];
  }
}

// 生成唯一ID
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function GET() {
  try {
    console.log("Starting to get all links data...");
    const items = await getAllLinksData();
    console.log("Found", items.length, "items");
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error in links API:", error);
    return NextResponse.json(
      {
        error: "Failed to read links data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      url,
      icon,
      iconType,
      tags,
      featured,
      category,
    } = body;

    // 验证必填字段
    if (!title || !url || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 检查URL是否已存在
    const urlExists = await checkUrlExists(url);
    if (urlExists) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 400 },
      );
    }

    // 创建新项目
    const newItem: LinksItem = {
      id: generateId(),
      title,
      description: description || "",
      url,
      icon: icon || "",
      iconType: iconType || "image",
      tags: tags || [],
      featured: featured || false,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 添加到指定分类
    await addItemToCategory(category, newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      {
        error: "Failed to create item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      description,
      url,
      icon,
      iconType,
      tags,
      featured,
      category,
    } = body;

    // 验证必填字段
    if (!title || !url || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 检查URL是否已存在（排除当前项目）
    const urlExists = await checkUrlExists(url, id);
    if (urlExists) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 400 },
      );
    }

    // 更新项目
    const updatedItem = await updateItem(id, {
      title,
      description: description || "",
      url,
      icon: icon || "",
      iconType: iconType || "image",
      tags: tags || [],
      featured: featured || false,
      category,
    });

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      {
        error: "Failed to update item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    // 删除项目
    const success = await deleteItem(id);

    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      {
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
