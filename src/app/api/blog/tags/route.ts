import { NextResponse } from "next/server";

import { getAllTagsWithCount } from "@/features/blog/lib";

/**
 * 获取所有标签及其计数的 API 路由
 *
 * @returns 所有标签及其计数
 */
export function GET() {
  try {
    const tagsWithCount = getAllTagsWithCount();
    // 转换为TagCount数组
    const tagCounts = Object.entries(tagsWithCount).map(([tag, count]) => ({
      tag,
      count,
    }));
    return NextResponse.json(tagCounts);
  } catch (error) {
    console.error("获取标签列表失败:", error);
    return NextResponse.json(
      {
        error: "获取标签列表失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
