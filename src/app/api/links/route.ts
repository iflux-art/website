import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import {
  CategoryId,
  LinksItem,
  LinksFormData,
} from "packages/src/types/links/links-types";

const filePath = path.join(
  process.cwd(),
  "packages/src/config/links/items.json",
);

// 工具函数仅文件内部使用
const getLinksData = async (): Promise<LinksItem[]> => {
  try {
    const config = await fs.readFile(filePath, "utf-8");
    return JSON.parse(config) as LinksItem[];
  } catch (error) {
    console.error("Error reading links config:", error);
    return [];
  }
};

const writeLinksData = async (items: LinksItem[]): Promise<void> => {
  try {
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing links config:", error);
    throw error;
  }
};

export async function GET() {
  try {
    const items = await getLinksData();
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

    const items = await getLinksData();

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
    await writeLinksData(items);
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
    const items = await getLinksData();
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
    await writeLinksData(items);
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

    const items = await getLinksData();
    const idx = items.findIndex((item) => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    items.splice(idx, 1);
    await writeLinksData(items);
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
