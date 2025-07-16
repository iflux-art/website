import { NextResponse } from "next/server";
import { getAllTagsWithCount } from "packages/src/lib/content";

/**
 * 获取所有标签及其文章数量的 API 路由
 *
 * @returns 所有标签及其文章数量
 */
export async function GET() {
  try {
    const tagCounts = getAllTagsWithCount();
    return NextResponse.json(tagCounts);
  } catch (error) {
    console.error("获取标签统计失败:", error);
    return NextResponse.json({ error: "获取标签统计失败" }, { status: 500 });
  }
}
