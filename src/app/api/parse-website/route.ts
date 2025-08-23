import type { NextRequest } from 'next/server';
import { parseWebsite } from '@/features/website-parser';
import { createApiSuccess, ApiErrors, isValidUrl } from '@/lib/api-utils';
import { withPublicApi } from '@/lib/api-middleware';

async function handleParseWebsite(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  // URL 验证
  if (!url || !isValidUrl(url)) {
    return ApiErrors.validation('Invalid or missing URL parameter');
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

  return ApiErrors.internal('Failed to parse website', result.error);
}

export const GET = withPublicApi(handleParseWebsite);
