import { NextResponse } from "next/server";
import { getDocCategories } from "@/features/docs/lib";
import { setCacheHeaders } from "@/lib/api/cache-utils";

/**
 * 获取所有文档分类的 API 路由
 *
 * @returns 所有文档分类列表
 */
export function GET() {
  try {
    const categories = getDocCategories();
    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(categories, { headers });
  } catch (error) {
    // Failed to get document categories
    return NextResponse.json(
      {
        error: "获取文档分类列表失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
