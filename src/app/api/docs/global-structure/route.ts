import { NextResponse } from "next/server";
import { getAllDocsStructure } from "@/features/docs/components";

/**
 * 获取全局文档结构的 API 路由
 *
 * @returns 全局文档结构，包含所有分类和文档的完整导航树
 */
// biome-ignore lint/style/useNamingConvention: GET is a standard HTTP method name for Next.js API routes
export function GET() {
  try {
    const structure = getAllDocsStructure();

    // 设置缓存控制头，避免浏览器缓存
    return NextResponse.json(structure, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
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
