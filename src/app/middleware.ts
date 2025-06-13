import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 缓存配置
 */
const CACHE_CONFIG = {
  // 静态资源缓存时间（1年）
  staticAssets: 60 * 60 * 24 * 365,
  
  // 字体缓存时间（1年）
  fonts: 60 * 60 * 24 * 365,
  
  // 图片缓存时间（1周）
  images: 60 * 60 * 24 * 7,
  
  // API 缓存时间（1小时）
  api: 60 * 60,
  
  // 页面缓存时间（1天）
  pages: 60 * 60 * 24,
};

/**
 * 中间件
 * 
 * 用于添加 HTTP 缓存头
 * 
 * @param request 请求对象
 * @returns 响应对象
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 创建响应对象
  const response = NextResponse.next();
  
  // 添加安全头
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 添加 CSP 头
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );
  
  // 添加缓存头
  if (
    pathname.match(/\.(js|css|json|xml|txt|ico|png|jpg|jpeg|gif|webp|avif|svg)$/) ||
    pathname.startsWith('/_next/static/')
  ) {
    // 静态资源
    response.headers.set(
      'Cache-Control',
      `public, max-age=${CACHE_CONFIG.staticAssets}, immutable`
    );
  } else if (pathname.match(/\.(woff|woff2|ttf|otf)$/)) {
    // API 路由
    response.headers.set(
      'Cache-Control',
      `public, max-age=${CACHE_CONFIG.api}, s-maxage=${CACHE_CONFIG.api * 2}, stale-while-revalidate=${CACHE_CONFIG.api * 10}`
    );
  } else if (
    pathname === '/' ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/navigation') ||
    pathname.startsWith('/friends')
  ) {
    // 页面
    response.headers.set(
      'Cache-Control',
      `public, max-age=${CACHE_CONFIG.pages}, s-maxage=${CACHE_CONFIG.pages * 2}, stale-while-revalidate=${CACHE_CONFIG.pages * 10}`
    );
  } else {
    // 其他
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, must-revalidate'
    );
  }
  
  return response;
}

/**
 * 配置
 */
export const config = {
  matcher: [
    // 静态资源
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
