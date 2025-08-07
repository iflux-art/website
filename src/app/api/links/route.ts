import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import _items from "@/config/links/items.json";
import { CategoryId, LinksItem, LinksFormData } from "@/types/links-types";
import { validateLinksFormData, validateLinksUpdate } from "@/utils";

// 工具函数仅文件内部使用
const getLinksData = async (): Promise<LinksItem[]> => {
  return _items as LinksItem[];
};

const writeLinksData = async (items: LinksItem[]): Promise<void> => {
  const fs = await import("fs/promises");
  const path = await import("path");

  try {
    const filePath = path.join(process.cwd(), "src/config/links/items.json");
    const jsonData = JSON.stringify(items, null, 2);
    await fs.writeFile(filePath, jsonData, "utf8");
  } catch (error) {
    console.error("Error writing links data:", error);
    throw new Error("Failed to write links data to file");
  }
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

    // 使用统一的验证函数
    const validation = validateLinksFormData(formData);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const validatedFormData = validation.data!;
    const items = await getLinksData();

    if (items.some((item) => item.url === validatedFormData.url)) {
      return NextResponse.json(
        { error: "URL already exists" },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newItem: LinksItem = {
      ...validatedFormData,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };

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

    // 使用统一的验证函数
    const validation = validateLinksUpdate(linksData, id, validatedUpdates);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 409 });
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
