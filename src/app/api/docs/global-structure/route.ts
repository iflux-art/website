import { NextResponse } from "next/server";
import { getAllDocsStructure } from "@/features/docs/components/global-docs";
import { setCacheHeaders } from "@/lib/api/cache-utils";

/**
 * 获取全局文档结构的 API 路由
 *
 * @returns 全局文档结构，包含所有分类和文档的完整导航树
 */
export function GET() {
  try {
    const structure = getAllDocsStructure();

    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(structure, { headers });
  } catch (error) {
    // Failed to get global docs structure
    return NextResponse.json(
      {
        error: "获取全局文档结构失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
