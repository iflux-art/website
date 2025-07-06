import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CACHE_CONFIG, CSP_CONFIG, SECURITY_HEADERS, buildCSP } from '@/config/middleware-config';

/**
 * 获取缓存策略
 */
const getCacheControl = (pathname: string): string => {
  // 静态资源
  if (pathname.match(/\.(js|css|json|xml|txt|ico)$/) || pathname.startsWith('/_next/static/')) {
    return `public, max-age=${CACHE_CONFIG.staticAssets}, immutable`;
  }

  // 图片
  if (pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) {
    return `public, max-age=${CACHE_CONFIG.images}, s-maxage=${
      CACHE_CONFIG.images * 2
    }, stale-while-revalidate=${CACHE_CONFIG.images * 10}`;
  }

  // 字体
  if (pathname.match(/\.(woff|woff2|ttf|otf)$/)) {
    return `public, max-age=${CACHE_CONFIG.fonts}, immutable`;
  }

  // API 路由
  if (pathname.includes('/api/')) {
    return `public, max-age=${CACHE_CONFIG.api}, s-maxage=${
      CACHE_CONFIG.api * 2
    }, stale-while-revalidate=${CACHE_CONFIG.api * 10}`;
  }

  // 主要页面
  if (
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/journal') ||
    pathname.startsWith('/links') ||
    pathname.startsWith('/tools')
  ) {
    return `public, max-age=${CACHE_CONFIG.pages}, s-maxage=${
      CACHE_CONFIG.pages * 2
    }, stale-while-revalidate=${CACHE_CONFIG.pages * 10}`;
  }

  // 其他动态路由
  return 'public, max-age=0, must-revalidate';
};

/**
 * 中间件
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 设置安全头
  response.headers.set('Content-Security-Policy', buildCSP(CSP_CONFIG));
  response.headers.set('Cache-Control', getCacheControl(pathname));
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/images/:path*',
    '/fonts/:path*',
    '/(api|app/api)/:path*',
  ],
};
