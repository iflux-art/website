import { NextResponse } from "next/server";
import { getAllPosts } from "@/features/blog/lib";
import { setCacheHeaders } from "@/lib/api/cache-utils";

export async function GET() {
  try {
    const posts = await getAllPosts();
    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(posts, { headers });
  } catch (error) {
    console.error("获取博客文章列表失败:", error);
    return NextResponse.json(
      {
        error: "获取博客文章列表失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
