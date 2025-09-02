import { type NextRequest, NextResponse } from "next/server";
import { performServerSearch } from "@/features/search/lib/server-search";
import { setCacheHeaders } from "@/lib/api/cache-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const type = searchParams.get("type") ?? "all";
    const limit = Number.parseInt(searchParams.get("limit") ?? "10", 10);

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const { results } = await performServerSearch(query, type, limit);
    // 设置缓存控制头
    const headers = setCacheHeaders("dynamic");
    return NextResponse.json({ results }, { headers });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
