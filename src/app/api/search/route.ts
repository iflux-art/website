import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/links/items.json");

// 工具函数仅文件内部使用
const getLinksData = async (): Promise<any[]> => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as any[];
  } catch (error) {
    console.error("Error reading links data:", error);
    return [];
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // 搜索链接
    if (type === "all" || type === "links") {
      const items = await getLinksData();
      const linkResults = items
        .filter((item: any) => {
          const searchText =
            `${item.title} ${item.description} ${item.tags?.join(" ")}`.toLowerCase();
          return searchText.includes(query.toLowerCase());
        })
        .map((item: any) => ({
          type: "link",
          title: item.title,
          description: item.description,
          url: item.url,
          category: item.category,
          tags: item.tags,
          icon: item.icon,
        }))
        .slice(0, 10);

      results.push(...linkResults);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
