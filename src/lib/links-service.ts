/**
 * 统一的链接数据管理服务
 * 提供一致的数据访问接口，支持多种存储后端
 */

import type { LinksData, LinksItem, LinksCategory } from '@/types';
import type { CategoryId } from '@/types/links';

// 存储类型
export type StorageType = 'file' | 'memory' | 'database';

// 存储接口
export interface LinksStorage {
  read(): Promise<LinksData>;
  write(data: LinksData): Promise<void>;
  addItem(item: Omit<LinksItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinksItem>;
  updateItem(id: string, updates: Partial<LinksItem>): Promise<LinksItem>;
  deleteItem(id: string): Promise<void>;
  getCategories(): Promise<LinksCategory[]>;
  getAllTags(): Promise<string[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCategoryId(id: string | unknown): id is CategoryId {
  return [
    'ai',
    'development',
    'design',
    'audio',
    'video',
    'office',
    'productivity',
    'operation',
    'profile',
    'friends',
  ].includes(id as string);
}

// 文件存储实现
export class FileLinksStorage implements LinksStorage {
  async read(): Promise<LinksData> {
    const { readLinksData } = await import('@/components/layout/links/admin/links-manage');
    const raw = readLinksData();
    const validCategoryIds = [
      'ai',
      'development',
      'design',
      'audio',
      'video',
      'office',
      'productivity',
      'operation',
      'profile',
      'friends',
    ];
    const categories: LinksCategory[] = raw.categories.map(cat => ({
      ...cat,
      title: cat.name,
      id: String(cat.id),
    }));
    const items: LinksItem[] = raw.items.map(item => ({
      ...item,
      icon: item.icon || '',
      iconType: item.iconType || 'image',
      category: validCategoryIds.includes(item.category) ? item.category : 'ai',
      featured: typeof item.featured === 'boolean' ? item.featured : false,
    }));
    return { categories, items };
  }

  async write(data: LinksData): Promise<void> {
    const { writeLinksData } = await import('@/components/layout/links/admin/links-manage');
    const validCategoryIds = [
      'ai',
      'development',
      'design',
      'audio',
      'video',
      'office',
      'productivity',
      'operation',
      'profile',
      'friends',
    ];
    const categoriesToWrite = data.categories.map(cat => ({
      id: validCategoryIds.includes(cat.id) ? (cat.id as CategoryId) : 'ai',
      name: cat.title || cat.name,
      description: cat.description,
      order: typeof cat.order === 'number' ? cat.order : 0,
      icon: cat.icon,
      color: cat.color,
    }));
    const itemsToWrite = data.items.map(item => {
      const cat = isCategoryId(String(item.category))
        ? (item.category as CategoryId)
        : ('ai' as CategoryId);
      return {
        ...item,
        icon: item.icon || '',
        iconType: item.iconType || 'image',
        category: cat,
        featured: typeof item.featured === 'boolean' ? item.featured : false,
        createdAt:
          typeof item.createdAt === 'string'
            ? item.createdAt
            : item.createdAt instanceof Date
              ? item.createdAt.toISOString()
              : String(item.createdAt),
        updatedAt:
          typeof item.updatedAt === 'string'
            ? item.updatedAt
            : item.updatedAt instanceof Date
              ? item.updatedAt.toISOString()
              : String(item.updatedAt),
      };
    });
    writeLinksData({ categories: categoriesToWrite, items: itemsToWrite });
  }

  async addItem(item: Omit<LinksItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinksItem> {
    const { addLinksItem } = await import('@/components/layout/links/admin/links-manage');
    return addLinksItem({
      ...item,
      icon: item.icon || '',
      iconType: item.iconType || 'image',
      category: isCategoryId(String(item.category))
        ? (item.category as CategoryId)
        : ('ai' as CategoryId),
      featured: typeof item.featured === 'boolean' ? item.featured : false,
    });
  }

  async updateItem(id: string, updates: Partial<LinksItem>): Promise<LinksItem> {
    const { updateLinksItem } = await import('@/components/layout/links/admin/links-manage');
    const validCategoryIds = [
      'ai',
      'development',
      'design',
      'audio',
      'video',
      'office',
      'productivity',
      'operation',
      'profile',
      'friends',
    ];
    return updateLinksItem(id, {
      ...updates,
      icon: updates.icon ?? '',
      iconType: updates.iconType ?? 'image',
      category:
        updates.category && validCategoryIds.includes(updates.category)
          ? (updates.category as CategoryId)
          : undefined,
      createdAt:
        updates.createdAt && typeof updates.createdAt === 'string'
          ? updates.createdAt
          : updates.createdAt instanceof Date
            ? updates.createdAt.toISOString()
            : undefined,
      updatedAt:
        updates.updatedAt && typeof updates.updatedAt === 'string'
          ? updates.updatedAt
          : updates.updatedAt instanceof Date
            ? updates.updatedAt.toISOString()
            : undefined,
    });
  }

  async deleteItem(id: string): Promise<void> {
    const { deleteLinksItem } = await import('@/components/layout/links/admin/links-manage');
    deleteLinksItem(id);
  }

  async getCategories(): Promise<LinksCategory[]> {
    const { getCategories } = await import('@/components/layout/links/admin/links-manage');
    const raw = getCategories();
    return raw.map(cat => ({ ...cat, title: cat.name, id: String(cat.id) }));
  }

  async getAllTags(): Promise<string[]> {
    const { getAllTags } = await import('@/components/layout/links/admin/links-manage');
    return getAllTags();
  }
}

// 内存存储实现（用于测试）
export class MemoryLinksStorage implements LinksStorage {
  private data: LinksData = { categories: [], items: [] };

  async read(): Promise<LinksData> {
    return { ...this.data };
  }

  async write(data: LinksData): Promise<void> {
    this.data = { ...data };
  }

  async addItem(item: Omit<LinksItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinksItem> {
    const newItem: LinksItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.items.push(newItem);
    return newItem;
  }

  async updateItem(id: string, updates: Partial<LinksItem>): Promise<LinksItem> {
    const itemIndex = this.data.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Links item not found');
    }

    const updatedItem: LinksItem = {
      ...this.data.items[itemIndex],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    this.data.items[itemIndex] = updatedItem;
    return updatedItem;
  }

  async deleteItem(id: string): Promise<void> {
    const itemIndex = this.data.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Links item not found');
    }

    this.data.items.splice(itemIndex, 1);
  }

  async getCategories(): Promise<LinksCategory[]> {
    return this.data.categories.map(cat => ({
      ...cat,
      count: this.data.items.filter(item => item.category === cat.id).length,
    }));
  }

  async getAllTags(): Promise<string[]> {
    const tags = new Set<string>();
    this.data.items.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
}

// 链接服务类
export class LinksService {
  private storage: LinksStorage;

  constructor(storageType: StorageType = 'file') {
    switch (storageType) {
      case 'file':
        this.storage = new FileLinksStorage();
        break;
      case 'memory':
        this.storage = new MemoryLinksStorage();
        break;
      case 'database':
        // TODO: 实现数据库存储
        throw new Error('Database storage not implemented yet');
      default:
        throw new Error(`Unknown storage type: ${storageType}`);
    }
  }

  // 获取所有数据
  async getData(): Promise<LinksData> {
    return this.storage.read();
  }

  // 添加链接
  async addLink(item: Omit<LinksItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinksItem> {
    return this.storage.addItem(item);
  }

  // 更新链接
  async updateLink(id: string, updates: Partial<LinksItem>): Promise<LinksItem> {
    return this.storage.updateItem(id, updates);
  }

  // 删除链接
  async deleteLink(id: string): Promise<void> {
    return this.storage.deleteItem(id);
  }

  // 获取分类
  async getCategories(): Promise<LinksCategory[]> {
    return this.storage.getCategories();
  }

  // 获取所有标签
  async getAllTags(): Promise<string[]> {
    return this.storage.getAllTags();
  }

  // 按分类获取链接
  async getLinksByCategory(categoryId: string): Promise<LinksItem[]> {
    const data = await this.getData();
    return data.items.filter(item => item.category === categoryId);
  }

  // 按标签获取链接
  async getLinksByTag(tag: string): Promise<LinksItem[]> {
    const data = await this.getData();
    return data.items.filter(item => item.tags.includes(tag));
  }

  // 搜索链接
  async searchLinks(query: string): Promise<LinksItem[]> {
    const data = await this.getData();
    const lowerQuery = query.toLowerCase();

    return data.items.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // 获取推荐链接
  async getFeaturedLinks(): Promise<LinksItem[]> {
    const data = await this.getData();
    return data.items.filter(item => item.featured);
  }

  // 验证链接数据
  validateLinkData(item: Partial<LinksItem>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.title?.trim()) {
      errors.push('标题不能为空');
    }

    if (!item.url?.trim()) {
      errors.push('URL 不能为空');
    } else {
      try {
        new URL(item.url);
      } catch {
        errors.push('URL 格式不正确');
      }
    }

    if (!item.category?.trim()) {
      errors.push('分类不能为空');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// 默认服务实例
export const linksService = new LinksService('file');

// 导出类型
export type { LinksData, LinksItem, LinksCategory };
