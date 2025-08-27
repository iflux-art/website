/**
 * 链接数据预加载初始化
 * 在应用启动时预加载关键链接数据，提升首次访问性能
 */

import { preloadCriticalCategories } from "@/features/links/lib";

/**
 * 初始化链接数据预加载
 * 在客户端初始化时调用，预加载关键分类数据
 */
export function initLinksPreload(): Promise<void> {
  try {
    // 检查是否在浏览器环境中
    if (typeof window !== "undefined") {
      // 延迟执行预加载，避免阻塞主渲染流程
      return new Promise(resolve => {
        setTimeout(() => {
          preloadCriticalCategories()
            .then(() => resolve())
            .catch(error => {
              if (process.env.NODE_ENV === "development") {
                console.warn("Failed to preload critical link categories:", error);
              }
              resolve(); // 即使预加载失败也resolve，不阻塞应用
            });
        }, 1000); // 延迟1秒执行
      });
    }
    return Promise.resolve();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to initialize links preload:", error);
    }
    return Promise.resolve();
  }
}
