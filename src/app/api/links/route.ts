import { linkService } from "@/features/links/services/link-service";
import type { LinksItem } from "@/features/links/types";
import { type NextRequest, NextResponse } from "next/server";
import { setCacheHeaders } from "@/lib/api/cache-utils";

// 添加缓存变量
let cachedLinksData: LinksItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export async function GET() {
  try {
    // 检查缓存是否有效
    const now = Date.now();
    if (cachedLinksData && now - cacheTimestamp < CACHE_DURATION) {
      // 使用缓存数据
      return NextResponse.json(cachedLinksData);
    }

    // 通过服务层获取数据
    const items = await linkService.getAllLinks();

    // 更新缓存
    cachedLinksData = items;
    cacheTimestamp = now;

    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(items, { headers });
  } catch (error) {
    console.error("Error in links API:", error);
    return NextResponse.json(
      {
        error: "Failed to read links data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 通过服务层创建新链接
    const newItem = await linkService.addLink(body);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);

    // 处理特定错误类型
    if (error instanceof Error) {
      if (error.message.includes("Missing required fields")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("URL already exists")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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

    // 通过服务层更新链接
    const updatedItem = await linkService.updateLink(id, body);

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);

    // 处理特定错误类型
    if (error instanceof Error) {
      if (error.message.includes("Missing required fields")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("URL already exists")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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

    // 通过服务层删除链接
    const success = await linkService.deleteLink(id);

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
      { status: 500 }
    );
  }
}
