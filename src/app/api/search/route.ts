import { NextRequest, NextResponse } from "next/server";
import { getLinksData } from "@/lib/admin/get-links-data-server";
import type { LinksItem } from "@/types";

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
        .filter((item: LinksItem) => {
          const searchText =
            `${item.title} ${item.description} ${item.tags?.join(" ")}`.toLowerCase();
          return searchText.includes(query.toLowerCase());
        })
        .map((item: LinksItem) => ({
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
