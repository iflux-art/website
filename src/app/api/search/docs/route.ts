import { type NextRequest, NextResponse } from "next/server";
import { searchDocs } from "@/features/docs/lib/doc-search";
import type { DocSearchResult } from "@/features/docs/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const limit = Number.parseInt(searchParams.get("limit") ?? "10", 10);

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const searchResults: DocSearchResult[] = await searchDocs(query, limit);

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching docs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
