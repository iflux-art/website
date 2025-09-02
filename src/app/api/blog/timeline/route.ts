import { NextResponse } from "next/server";
import { getPostsByYear } from "@/features/blog/lib";

/**
 * GET 处理程序
 * 返回按年份分组的博客文章
 */
export function GET() {
  try {
    const postsByYear = getPostsByYear();
    return NextResponse.json(postsByYear);
  } catch (error) {
    console.error("Error fetching timeline posts:", error);
    return NextResponse.json({ error: "Failed to fetch timeline posts" }, { status: 500 });
  }
}
