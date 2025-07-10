/**
 * 中间件配置
 */

/**
 * 中间件缓存配置
 */
export const MIDDLEWARE_CACHE_CONFIG = {
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
} as const;

/**
 * 内容安全策略配置
 */
export const CSP_CONFIG = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://cdn.jsdelivr.net",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https:"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "upgrade-insecure-requests": [],
} as const;

/**
 * 安全头配置
 */
export const SECURITY_HEADERS = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
} as const;

/**
 * 构建 CSP 字符串
 */
export const buildCSP = (config: typeof CSP_CONFIG) => {
  return Object.entries(config)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
};
