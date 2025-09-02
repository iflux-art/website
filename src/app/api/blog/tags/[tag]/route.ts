import { NextResponse } from "next/server";
import { getPostsByTag } from "@/features/blog/lib";

/**
 * 获取指定标签的文章列表的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含标签名称
 * @returns 包含指定标签的文章列表
 */
export async function GET(_request: Request, { params }: { params: Promise<{ tag: string }> }) {
  try {
    const resolvedParams = await params;
    const { tag } = resolvedParams;
    const decodedTag = decodeURIComponent(tag);
    const posts = getPostsByTag(decodedTag);
    return NextResponse.json(posts);
  } catch (error) {
    console.error(`获取标签 ${(await params).tag} 的文章列表失败:`, error);
    return NextResponse.json(
      { error: `获取标签 ${(await params).tag} 的文章列表失败` },
      { status: 500 }
    );
  }
}
