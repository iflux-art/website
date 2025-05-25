/**
 * localStorage 缓存工具
 *
 * 用于统一管理 localStorage 缓存逻辑
 */

/**
 * 缓存项接口
 */
interface LocalStorageCacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * localStorage 缓存类
 */
class LocalStorageCache {
  private prefix: string;
  private defaultExpiry: number;

  constructor(prefix: string = '', defaultExpiry: number = 30 * 60 * 1000) {
    this.prefix = prefix;
    this.defaultExpiry = defaultExpiry;
  }

  /**
   * 生成缓存键
   */
  private generateKey(key: string): string {
    return this.prefix ? `${this.prefix}${key}` : key;
  }

  /**
   * 检查是否支持 localStorage
   */
  private isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取缓存数据
   */
  get<T>(key: string, expiry?: number): T | null {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const cacheKey = this.generateKey(key);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) {
        return null;
      }

      const item: LocalStorageCacheItem<T> = JSON.parse(cached);
      const now = Date.now();
      const cacheExpiry = expiry || this.defaultExpiry;

      // 检查缓存是否过期
      if (now - item.timestamp > cacheExpiry) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('获取 localStorage 缓存失败:', error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   */
  set<T>(key: string, data: T): void {
    if (!this.isSupported()) {
      return;
    }

    try {
      const cacheKey = this.generateKey(key);
      const item: LocalStorageCacheItem<T> = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(cacheKey, JSON.stringify(item));
    } catch (error) {
      console.error('设置 localStorage 缓存失败:', error);
    }
  }

  /**
   * 移除缓存数据
   */
  remove(key: string): void {
    if (!this.isSupported()) {
      return;
    }

    try {
      const cacheKey = this.generateKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('移除 localStorage 缓存失败:', error);
    }
  }

  /**
   * 清除所有缓存（仅清除带前缀的）
   */
  clear(): void {
    if (!this.isSupported()) {
      return;
    }

    try {
      if (!this.prefix) {
        // 如果没有前缀，不执行清除操作以避免误删其他数据
        console.warn('没有设置前缀，跳过清除操作');
        return;
      }

      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('清除 localStorage 缓存失败:', error);
    }
  }

  /**
   * 获取缓存大小（字节）
   */
  getSize(): number {
    if (!this.isSupported()) {
      return 0;
    }

    try {
      let size = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (!this.prefix || key.startsWith(this.prefix))) {
          const value = localStorage.getItem(key);
          if (value) {
            size += key.length + value.length;
          }
        }
      }
      return size;
    } catch (error) {
      console.error('获取 localStorage 缓存大小失败:', error);
      return 0;
    }
  }

  /**
   * 带缓存的异步函数执行
   */
  async withCache<T>(key: string, fn: () => Promise<T>, expiry?: number): Promise<T> {
    // 尝试从缓存获取
    const cached = this.get<T>(key, expiry);
    if (cached !== null) {
      return cached;
    }

    // 执行函数并缓存结果
    const result = await fn();
    this.set(key, result);
    return result;
  }
}

// 创建预配置的缓存实例
export const docsSidebarCache = new LocalStorageCache('docs-sidebar-', 30 * 60 * 1000);
export const docsCategoriesCache = new LocalStorageCache('docs-categories-', 30 * 60 * 1000);
export const generalCache = new LocalStorageCache('app-cache-', 30 * 60 * 1000);

// 导出类以供自定义使用
export { LocalStorageCache };
