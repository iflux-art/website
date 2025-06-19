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
 * 内容安全策略配置
 */
const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https:'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'upgrade-insecure-requests': [],
};

/**
 * 安全头配置
 */
const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

/**
 * 构建 CSP 字符串
 */
const buildCSP = (config: Record<string, string[]>) => {
  return Object.entries(config)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

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

  // 内容安全策略
  response.headers.set('Content-Security-Policy', buildCSP(CSP_CONFIG));

  // 缓存策略
  response.headers.set('Cache-Control', getCacheControl(pathname));

  // 设置安全头
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * 中间件配置
 */
export const config = {
  matcher: [
    // 排除不需要处理的路径
    '/((?!_next/static|_next/image|favicon.ico).*)',

    // 包含需要处理的静态资源
    '/images/:path*',
    '/fonts/:path*',
    '/(api|app/api)/:path*',
  ],
};
