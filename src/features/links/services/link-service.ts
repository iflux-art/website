/**
 * 链接管理服务层
 * 提供统一的链接数据访问接口
 */

import type { LinksItem } from "@/features/links/types";
import { loadAllLinksData } from "@/features/links/lib";
import {
  checkUrlExists,
  addItemToCategory,
  updateItem,
  deleteItem,
} from "@/features/links/lib/categories";

// 服务层接口定义
export interface LinkService {
  getAllLinks: () => Promise<LinksItem[]>;
  addLink: (data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem | null>;
  deleteLink: (id: string) => Promise<boolean>;
  checkUrlExists: (url: string, excludeId?: string) => Promise<boolean>;
}

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 链接服务实现
class LinkServiceImpl implements LinkService {
  /**
   * 获取所有链接数据
   */
  async getAllLinks(): Promise<LinksItem[]> {
    try {
      const items = await loadAllLinksData();
      return items;
    } catch (error) {
      console.error("Error fetching links:", error);
      throw new Error("Failed to fetch links data");
    }
  }

  /**
   * 添加新链接
   */
  async addLink(data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">): Promise<LinksItem> {
    const { title, url, category, description, icon, iconType, tags, featured } = data;

    // 验证必填字段
    if (!(title && url && category)) {
      throw new Error("Missing required fields: title, url, and category are required");
    }

    // 检查URL是否已存在
    const urlExists = await this.checkUrlExists(url);
    if (urlExists) {
      throw new Error("URL already exists");
    }

    // 创建新项目
    const newItem: LinksItem = {
      id: generateId(),
      title,
      description: description ?? "",
      url,
      icon: icon ?? "",
      iconType: iconType ?? "image",
      tags: tags ?? [],
      featured: featured ?? false,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 添加到指定分类
    addItemToCategory(category, newItem);

    return newItem;
  }

  /**
   * 更新链接
   */
  async updateLink(id: string, data: Partial<LinksItem>): Promise<LinksItem | null> {
    const { title, url, category, description, icon, iconType, tags, featured } = data;

    // 验证必填字段（如果提供了的话）
    if (
      (title !== undefined && !title) ||
      (url !== undefined && !url) ||
      (category !== undefined && !category)
    ) {
      throw new Error("Invalid fields: title, url, and category cannot be empty");
    }

    // 如果提供了URL，检查是否已存在（排除当前项目）
    if (url !== undefined) {
      const urlExists = await this.checkUrlExists(url, id);
      if (urlExists) {
        throw new Error("URL already exists");
      }
    }

    // 构建更新数据
    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(url !== undefined && { url }),
      ...(icon !== undefined && { icon }),
      ...(iconType !== undefined && { iconType }),
      ...(tags !== undefined && { tags }),
      ...(featured !== undefined && { featured }),
      ...(category !== undefined && { category }),
      updatedAt: new Date().toISOString(),
    };

    // 更新项目
    const updatedItem = updateItem(id, updateData);

    return updatedItem;
  }

  /**
   * 删除链接
   */
  deleteLink(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Missing item ID");
    }

    // 删除项目
    const success = deleteItem(id);

    return Promise.resolve(success);
  }

  /**
   * 检查URL是否已存在
   */
  checkUrlExists(url: string, excludeId?: string): Promise<boolean> {
    if (!url) {
      return Promise.resolve(false);
    }

    return Promise.resolve(checkUrlExists(url, excludeId));
  }
}

// 导出服务实例
export const linkService = new LinkServiceImpl();
