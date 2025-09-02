import type { NextRequest } from "next/server";
import { parseWebsite } from "@/features/website-parser/lib/parser";
import { withPublicApi } from "@/lib/api/api-middleware";
import { ApiErrors, createApiSuccess } from "@/lib/api/api-utils";
import { isValidUrl } from "@/utils/validation";

async function handleParseWebsite(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // URL 验证
  if (!(url && isValidUrl(url))) {
    return ApiErrors.validation("Invalid or missing URL parameter");
  }

  // 解析网站信息
  const result = await parseWebsite(url, {
    timeout: 10000,
    useCache: true,
    cacheMaxAge: 30 * 60 * 1000, // 30分钟
  });

  if (result.success && result.data) {
    return createApiSuccess(result.data, undefined, {
      maxAge: 1800, // 30分钟缓存
    });
  }

  // 解析失败但有fallback数据
  if (result.data) {
    return createApiSuccess(result.data);
  }

  return ApiErrors.internal("Failed to parse website", result.error);
}

// 应用公共API中间件
const handler = withPublicApi(handleParseWebsite);

// 添加CORS响应头的包装函数
export async function GET(request: NextRequest) {
  const response = await handler(request);
  return response;
}
