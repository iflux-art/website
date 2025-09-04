import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 中间件缓存配置
 */
const MIDDLEWARE_CACHE_CONFIG = {
  staticAssets: 3600, // 1小时
  fonts: 86400, // 1天
  images: 86400, // 1天
  api: 30, // 30秒
} as const;

/**
 * 内容安全策略配置
 */
const CSP_CONFIG = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https:"],
  "frame-src": ["'self'"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "worker-src": ["'self'", "blob:"],
  "upgrade-insecure-requests": [],
} as const;

/**
 * 安全头配置
 */
const SECURITY_HEADERS = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
} as const;

/**
 * 构建 CSP 字符串
 */
const buildCSP = (config: typeof CSP_CONFIG) =>
  Object.entries(config)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");

/**
 * 获取缓存策略
 */
const getCacheControl = (pathname: string): string => {
  const { staticAssets, fonts, images, api } = MIDDLEWARE_CACHE_CONFIG;

  // 静态资源
  if (/\.(js|css|json|xml|txt|ico)$/.test(pathname) || pathname.startsWith("/_next/static/")) {
    const maxAge = staticAssets;
    const sMaxAge = maxAge * 2;
    const staleWhileRevalidate = maxAge * 24;
    return `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
  }

  // 图片
  if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/.test(pathname)) {
    const maxAge = images;
    const sMaxAge = maxAge * 2;
    const staleWhileRevalidate = maxAge * 10;
    return `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
  }

  // 字体
  if (/\.(woff|woff2|ttf|otf)$/.test(pathname)) {
    const maxAge = fonts;
    const sMaxAge = maxAge * 2;
    const staleWhileRevalidate = maxAge * 24;
    return `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
  }

  // API路由
  if (pathname.includes("/api/")) {
    const maxAge = api;
    const sMaxAge = maxAge * 2;
    const staleWhileRevalidate = maxAge * 10;
    return `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
  }

  // 其他页面不缓存
  return "no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate";
};

/**
 * 中间件
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  // 在开发环境中使用更宽松的 CSP，生产环境中使用严格的 CSP
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    // 开发环境：适度宽松的 CSP 以支持开发工具
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob:; " +
        "style-src 'self' 'unsafe-inline' https: http:; " +
        "img-src 'self' data: https: http:; " +
        "font-src 'self' data: https: http:; " +
        "connect-src 'self' https: http: ws: wss:; " +
        "frame-src 'self' https: http:; " +
        "worker-src 'self' blob:; " +
        "form-action 'self' https: http:;"
    );
  } else {
    // 生产环境：严格的 CSP
    response.headers.set("Content-Security-Policy", buildCSP(CSP_CONFIG));
  }

  response.headers.set("Cache-Control", getCacheControl(pathname));

  // 设置安全头
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/images/:path*",
    "/fonts/:path*",
    "/api/:path*",
  ],
};
