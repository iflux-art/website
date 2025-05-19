import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 获取指定分类的元数据的 API 路由
 *
 * @param request 请求对象
 * @param params 路由参数，包含分类名称
 * @returns 指定分类的元数据
 */
export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;
    const decodedCategory = decodeURIComponent(category);

    // 首先尝试加载 JSON 元数据文件
    const jsonMetaPath = path.join(process.cwd(), 'src', 'content', 'docs', decodedCategory, '_meta.json');

    if (fs.existsSync(jsonMetaPath)) {
      // 读取 JSON 文件
      const metaContent = fs.readFileSync(jsonMetaPath, 'utf8');
      try {
        const meta = JSON.parse(metaContent);
        return NextResponse.json(meta);
      } catch (jsonError) {
        console.error(`解析 JSON 元数据文件失败:`, jsonError);
        // 如果 JSON 解析失败，继续尝试其他格式
      }
    }

    // 如果没有找到 JSON 文件或解析失败，返回空对象而不是错误
    // 这样客户端可以降级为使用文件列表
    return NextResponse.json({});
  } catch (error) {
    console.error(`获取分类 ${params.category} 的元数据失败:`, error);
    // 返回空对象而不是错误，允许客户端降级
    return NextResponse.json({});
  }
}
