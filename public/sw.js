/**
 * Service Worker
 *
 * 用于实现离线缓存和性能优化
 */

// 缓存名称
const CACHE_NAME = 'iflux-cache-v2';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/styles/non-critical.css',
  '/images/icons/favicon-16x16.png',
  '/images/icons/favicon-32x32.png',
  '/images/icons/apple-touch-icon.png',
  '/images/icons/ms-icon-144x144.png',
  '/offline.html'
];

// 需要缓存的页面
const PAGES_TO_CACHE = [
  '/',
  '/docs',
  '/blog',
  '/journal',
  '/links',
  '/tools'
];

// 需要缓存的 API 路由
const API_ROUTES_TO_CACHE = [
  '/api/docs/sidebar',
  '/api/docs/search',
  '/api/blog/posts',
  '/api/links/data',
  '/api/tools/data'
];

// 安装事件
self.addEventListener('install', (event) => {
  // 跳过等待，直接激活
  self.skipWaiting();

  // 缓存静态资源
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );

  // 立即控制所有页面
  return self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 忽略非 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 处理静态资源
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 处理页面请求
  if (PAGES_TO_CACHE.includes(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 处理 API 请求
  if (API_ROUTES_TO_CACHE.some(route => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 默认策略 - 网络优先
  event.respondWith(networkFirst(request));
});

/**
 * 缓存优先策略
 *
 * 先从缓存中获取，如果缓存中没有，则从网络获取并缓存
 *
 * @param {Request} request 请求对象
 * @returns {Promise<Response>} 响应对象
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // 如果是页面请求，返回离线页面
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/offline.html');
    }
    throw error;
  }
}

/**
 * 网络优先策略
 *
 * 先从网络获取，如果网络请求失败，则从缓存中获取
 *
 * @param {Request} request 请求对象
 * @returns {Promise<Response>} 响应对象
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 如果是页面请求，返回离线页面
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/offline.html');
    }
    throw error;
  }
}

/**
 * Stale While Revalidate 策略
 *
 * 先从缓存中获取，同时从网络获取并更新缓存
 *
 * @param {Request} request 请求对象
 * @returns {Promise<Response>} 响应对象
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);

  // 先从缓存中获取
  const cachedResponse = await cache.match(request);

  // 同时从网络获取并更新缓存
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  }).catch(() => {
    // 如果网络请求失败，返回一个空响应
    return new Response('', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  });

  // 如果缓存中有响应，直接返回
  if (cachedResponse) {
    return cachedResponse;
  }

  // 否则等待网络响应
  return networkResponsePromise;
}