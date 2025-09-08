import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 简化版中间件
 * 处理安全头和缓存策略
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDevelopment = process.env.NODE_ENV === "development";

  const response = NextResponse.next();

  // 设置内容安全策略
  if (isDevelopment) {
    // 开发环境使用宽松的 CSP
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
    // 生产环境使用严格 CSP
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https:; " +
        "frame-src 'self'; " +
        "frame-ancestors 'none'; " +
        "form-action 'self'; " +
        "base-uri 'self'; " +
        "worker-src 'self' blob:; " +
        "upgrade-insecure-requests;"
    );
  }

  // 设置缓存控制
  response.headers.set("Cache-Control", getCacheControl(pathname));

  // 设置安全头
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  return response;
}

/**
 * 获取缓存策略
 */
function getCacheControl(pathname: string): string {
  // 静态资源缓存策略
  if (/\.(js|css|json|xml|txt|ico)$/.test(pathname) || pathname.startsWith("/_next/static/")) {
    return "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400";
  }

  // 图片缓存策略
  if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/.test(pathname)) {
    return "public, max-age=86400, s-maxage=172800, stale-while-revalidate=864000";
  }

  // 字体缓存策略
  if (/\.(woff|woff2|ttf|otf)$/.test(pathname)) {
    return "public, max-age=86400, s-maxage=172800, stale-while-revalidate=2073600";
  }

  // API路由缓存策略
  if (pathname.includes("/api/")) {
    return "public, max-age=30, s-maxage=60, stale-while-revalidate=300";
  }

  // 其他页面不缓存
  return "no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate";
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/images/:path*",
    "/fonts/:path*",
    "/api/:path*",
  ],
};
