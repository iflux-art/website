import { NextResponse } from "next/server";
import { getDocCategories } from "@/features/docs/lib";

/**
 * 获取所有文档分类的 API 路由
 *
 * @returns 所有文档分类列表
 */
export async function GET() {
  try {
    const categories = getDocCategories();
    // 设置缓存控制头，避免浏览器缓存
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    // Failed to get document categories
    return NextResponse.json(
      {
        error: "获取文档分类列表失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    );
  }
}
