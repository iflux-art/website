/**
 * 预加载工具
 *
 * 用于在页面加载时预加载数据，提高用户体验
 */

/**
 * 预加载文档侧边栏数据
 *
 * @param category 文档分类
 * @returns 预加载的 Promise
 */
export async function preloadDocSidebar(category: string): Promise<void> {
  try {
    // 检查是否已经有缓存
    const cacheKey = `docs-sidebar-${category}`;
    const cachedData = localStorage.getItem(cacheKey);

    // 如果有缓存且未过期，不需要预加载
    if (cachedData) {
      try {
        const { timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const CACHE_EXPIRY = 30 * 60 * 1000; // 30分钟

        if (now - timestamp < CACHE_EXPIRY) {
          // 缓存未过期，不需要预加载
          return;
        }
      } catch (e) {
        // 解析缓存失败，继续预加载
        console.error('解析缓存失败:', e);
      }
    }

    // 预加载数据
    try {
      const response = await fetch(`/api/docs/sidebar/${encodeURIComponent(category)}`, {
        headers: {
          'Cache-Control': 'max-age=1800', // 30分钟
          Pragma: 'no-cache',
        },
        cache: 'no-store',
        priority: 'low', // 低优先级，不阻塞主要内容加载
      });

      // 检查响应状态
      if (!response.ok) {
        // 如果响应不成功，记录错误但不抛出异常
        console.warn(`预加载分类 ${category} 的侧边栏结构返回状态码 ${response.status}`);
        return;
      }

      const data = await response.json();

      // 检查数据是否有效
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn(`预加载分类 ${category} 的侧边栏结构返回空数据`);
        return;
      }

      // 将数据存入 localStorage
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      if (process.env.NODE_ENV === 'development') {
        console.log(`预加载分类 ${category} 的侧边栏结构成功`);
      }
    } catch (fetchError) {
      // 捕获网络错误，但不重新抛出
      console.warn(`预加载分类 ${category} 的侧边栏结构网络错误:`, fetchError);
    }
  } catch (error) {
    // 预加载失败不影响用户体验，只记录错误
    console.error(`预加载分类 ${category} 的侧边栏结构失败:`, error);
  }
}

/**
 * 预加载文档分类列表
 *
 * @returns 预加载的 Promise
 */
export async function preloadDocCategories(): Promise<void> {
  try {
    // 检查是否已经有缓存
    const cacheKey = 'docs-categories';
    const cachedData = localStorage.getItem(cacheKey);

    // 如果有缓存且未过期，不需要预加载
    if (cachedData) {
      try {
        const { timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const CACHE_EXPIRY = 30 * 60 * 1000; // 30分钟

        if (now - timestamp < CACHE_EXPIRY) {
          // 缓存未过期，不需要预加载
          return;
        }
      } catch (e) {
        // 解析缓存失败，继续预加载
        console.error('解析缓存失败:', e);
      }
    }

    // 预加载数据
    const response = await fetch('/api/docs/categories', {
      headers: {
        'Cache-Control': 'max-age=1800', // 30分钟
        Pragma: 'no-cache',
      },
      cache: 'no-store',
      priority: 'low', // 低优先级，不阻塞主要内容加载
    });

    if (!response.ok) {
      throw new Error('Failed to preload document categories');
    }

    const data = await response.json();

    // 将数据存入 localStorage
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('预加载文档分类列表成功');
    }
  } catch (error) {
    // 预加载失败不影响用户体验，只记录错误
    console.error('预加载文档分类列表失败:', error);
  }
}

/**
 * 预加载所有常用数据
 *
 * @returns 预加载的 Promise
 */
export async function preloadAll(): Promise<void> {
  try {
    // 先预加载文档分类
    await preloadDocCategories();

    // 获取文档分类列表
    const categoriesCache = localStorage.getItem('docs-categories');
    if (categoriesCache) {
      try {
        const { data } = JSON.parse(categoriesCache);

        // 如果有分类数据，预加载第一个分类的侧边栏
        if (data && Array.isArray(data) && data.length > 0) {
          // 找到第一个有效的分类
          const firstCategory = data.find(cat => cat && cat.slug);

          if (firstCategory) {
            // 预加载该分类的侧边栏
            await preloadDocSidebar(firstCategory.slug);
            return;
          }
        }
      } catch (e) {
        console.warn('解析文档分类缓存失败:', e);
      }
    }

    // 如果没有分类数据或解析失败，尝试预加载默认分类
    const defaultCategories = ['guide', 'docs', 'api', 'getting-started'];

    // 尝试预加载默认分类中的一个
    for (const category of defaultCategories) {
      try {
        await preloadDocSidebar(category);
        // 如果成功预加载了一个分类，就退出循环
        break;
      } catch (e) {
        // 忽略错误，尝试下一个分类
        console.warn(`预加载默认分类 ${category} 失败，尝试下一个`);
      }
    }
  } catch (error) {
    // 捕获所有错误，确保不会影响用户体验
    console.error('预加载数据失败:', error);
  }
}

/**
 * 在页面加载完成后预加载数据
 */
export function setupPreloading(): void {
  if (typeof window === 'undefined') {
    return; // 服务器端不执行
  }

  // 确保 localStorage 可用
  let localStorageAvailable = false;
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    localStorageAvailable = true;
  } catch (e) {
    console.warn('localStorage 不可用，预加载功能将被禁用');
    return;
  }

  // 如果 localStorage 不可用，不执行预加载
  if (!localStorageAvailable) {
    return;
  }

  // 包装预加载函数，确保错误不会传播
  const safePreload = () => {
    try {
      preloadAll().catch(error => {
        console.error('预加载过程中发生错误:', error);
      });
    } catch (error) {
      console.error('启动预加载过程失败:', error);
    }
  };

  // 使用 requestIdleCallback 在浏览器空闲时预加载数据
  if ('requestIdleCallback' in window) {
    try {
      window.requestIdleCallback(
        () => {
          safePreload();
        },
        { timeout: 5000 }
      ); // 5秒超时
    } catch (error) {
      // 如果 requestIdleCallback 失败，降级到 setTimeout
      console.warn('requestIdleCallback 失败，降级到 setTimeout:', error);
      setTimeout(safePreload, 3000);
    }
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(safePreload, 3000); // 页面加载 3 秒后预加载
  }
}
