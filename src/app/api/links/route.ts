import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import type { LinksItem, LinksFormData, CategoryId } from "@/types";

const filePath = path.join(process.cwd(), "src/data/links/items.json");

// 读取全部 items
async function readItems(): Promise<LinksItem[]> {
  const data = await fs.readFile(filePath, "utf-8");
  const items = JSON.parse(data);
  return items as LinksItem[];
}

// 写入全部 items
async function writeItems(items: LinksItem[]) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  try {
    const items = await readItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error reading links:", error);
    return NextResponse.json(
      {
        error: "Failed to read items",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // 手动验证表单数据
    if (!formData.title || !formData.url || !formData.category) {
      return NextResponse.json(
        { error: "标题、URL和分类为必填项" },
        { status: 400 },
      );
    }

    // 验证category是否为有效的CategoryId
    const validCategories = [
      "ai",
      "development",
      "design",
      "audio",
      "video",
      "office",
      "productivity",
      "operation",
      "profile",
      "friends",
    ];
    if (!validCategories.includes(formData.category)) {
      return NextResponse.json({ error: "无效的分类ID" }, { status: 400 });
    }

    const validatedFormData = {
      title: formData.title,
      url: formData.url,
      description: formData.description,
      category: formData.category as CategoryId,
      tags: formData.tags,
      featured: formData.featured,
      icon: formData.icon,
      iconType: formData.iconType || "text",
    };

    const items = await readItems();

    if (items.some((item) => item.url === validatedFormData.url)) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newItem = {
      ...validatedFormData,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    } as LinksItem;

    items.push(newItem);
    await writeItems(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error adding link:", error);
    return NextResponse.json(
      {
        error: "Failed to add item",
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updates = await request.json();
    const validatedUpdates = updates as Partial<LinksFormData>;
    const items = await readItems();
    const idx = items.findIndex((item) => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 检查 url 是否重复
    if (
      validatedUpdates.url &&
      items.some((item) => item.url === validatedUpdates.url && item.id !== id)
    ) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const updatedItem: LinksItem = {
      ...items[idx],
      ...validatedUpdates,
      updatedAt: now,
      category: (validatedUpdates.category ??
        items[idx].category) as CategoryId,
    };

    items[idx] = updatedItem;
    await writeItems(items);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating link:", error);
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const items = await readItems();
    const idx = items.findIndex((item) => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    items.splice(idx, 1);
    await writeItems(items);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      {
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
