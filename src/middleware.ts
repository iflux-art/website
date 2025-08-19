import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * 中间件缓存配置
 */
export const MIDDLEWARE_CACHE_CONFIG = {
  staticAssets: 3600, // 1小时
  fonts: 3600, // 1小时
  images: 86400, // 1天
  api: 30, // 30秒
  pages: 0, // 禁用
} as const;

/**
 * 内容安全策略配置 - 为 Clerk 优化
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://cdn.jsdelivr.net',
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://js.clerk.com',
  ],
  'script-src-elem': [
    "'self'",
    "'unsafe-inline'",
    'https://cdn.jsdelivr.net',
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://js.clerk.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://js.clerk.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://js.clerk.com',
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://js.clerk.com',
  ],
  'connect-src': [
    "'self'",
    'https:',
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://api.clerk.com',
    'https://js.clerk.com',
  ],
  'frame-src': [
    "'self'",
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://js.clerk.com',
  ],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'", 'https://*.clerk.accounts.dev', 'https://*.clerk.com'],
  'base-uri': ["'self'"],
  'upgrade-insecure-requests': [],
} as const;

/**
 * 安全头配置
 */
export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
} as const;

/**
 * 构建 CSP 字符串
 */
export const buildCSP = (config: typeof CSP_CONFIG) => {
  return Object.entries(config)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

/**
 * 获取缓存策略
 */
const getCacheControl = (pathname: string): string => {
  const { staticAssets, fonts, images, api } = MIDDLEWARE_CACHE_CONFIG;

  // 静态资源
  if (/\.(js|css|json|xml|txt|ico)$/.test(pathname) || pathname.startsWith('/_next/static/')) {
    return `public, max-age=${staticAssets}, s-maxage=${staticAssets * 2}, stale-while-revalidate=${staticAssets * 24}`;
  }

  // 图片
  if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/.test(pathname)) {
    return `public, max-age=${images}, s-maxage=${images * 2}, stale-while-revalidate=${images * 10}`;
  }

  // 字体
  if (/\.(woff|woff2|ttf|otf)$/.test(pathname)) {
    return `public, max-age=${fonts}, s-maxage=${fonts * 2}, stale-while-revalidate=${fonts * 24}`;
  }

  // API路由
  if (pathname.includes('/api/')) {
    return `public, max-age=${api}, s-maxage=${api * 2}, stale-while-revalidate=${api * 10}`;
  }

  // 主要页面和其他动态路由
  return 'public, max-age=0, must-revalidate';
};

// 定义需要保护的路由
const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

/**
 * 中间件
 */
export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 保护管理员路由
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  // 在开发环境中使用更宽松的 CSP，生产环境中使用严格的 CSP
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // 开发环境：更宽松的 CSP 以支持 Clerk
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; " +
        "script-src-elem 'self' 'unsafe-inline' https: http:; " +
        "style-src 'self' 'unsafe-inline' https: http:; " +
        "img-src 'self' data: https: http:; " +
        "font-src 'self' data: https: http:; " +
        "connect-src 'self' https: http: ws: wss:; " +
        "frame-src 'self' https: http:; " +
        "form-action 'self' https: http:;"
    );
  } else {
    // 生产环境：严格的 CSP
    response.headers.set('Content-Security-Policy', buildCSP(CSP_CONFIG));
  }

  response.headers.set('Cache-Control', getCacheControl(pathname));
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/images/:path*',
    '/fonts/:path*',
    '/api/:path*',
    '/app/api/:path*',
  ],
};
