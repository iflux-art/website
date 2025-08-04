import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import _items from "@/config/links/items.json";
import { CategoryId, LinksItem, LinksFormData } from "@/types/links-types";

// 工具函数仅文件内部使用
const getLinksData = async (): Promise<LinksItem[]> => {
  return _items as LinksItem[];
};

const writeLinksData = async (_items: LinksItem[]): Promise<void> => {
  // Disable write operations in development mode
  if (process.env.NODE_ENV === "development") {
    return;
  }
  throw new Error("Write operations are not implemented in this version");
};

export async function GET() {
  try {
    return NextResponse.json(await getLinksData());
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
    const linksData = await getLinksData();
    const idx = linksData.findIndex((item) => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 检查 url 是否重复
    if (
      validatedUpdates.url &&
      linksData.some(
        (item) => item.url === validatedUpdates.url && item.id !== id,
      )
    ) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const updatedItem: LinksItem = {
      ...linksData[idx],
      ...validatedUpdates,
      updatedAt: now,
      category: (validatedUpdates.category ??
        linksData[idx].category) as CategoryId,
    };

    linksData[idx] = updatedItem;
    await writeLinksData(linksData);
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

    const linksData = await getLinksData();
    const idx = linksData.findIndex((item) => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    linksData.splice(idx, 1);
    await writeLinksData(linksData);
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
