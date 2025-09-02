/**
 * 链接数据服务
 * 提供客户端链接数据访问接口
 */

import type { LinksItem } from "@/features/links/types";
import { get, post, put, del } from "@/lib/api/api-client";
import { CONTENT_API_PATHS } from "@/lib/api/api-paths";

// 链接数据服务接口
export interface LinkDataService {
  fetchLinks: () => Promise<LinksItem[]>;
  createLink: (data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem>;
  deleteLink: (id: string) => Promise<boolean>;
}

// 链接数据服务实现
class LinkDataServiceImpl implements LinkDataService {
  /**
   * 获取所有链接
   */
  async fetchLinks(): Promise<LinksItem[]> {
    const { data, error } = await get<LinksItem[]>(CONTENT_API_PATHS.Links, {
      next: { revalidate: 300 }, // 5分钟重新验证
    });

    if (error) {
      throw new Error(error);
    }

    return data;
  }

  /**
   * 创建新链接
   */
  async createLink(data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">): Promise<LinksItem> {
    const { data: newItem, error } = await post<LinksItem>(CONTENT_API_PATHS.Links, data);

    if (error) {
      throw new Error(error);
    }

    return newItem;
  }

  /**
   * 更新链接
   */
  async updateLink(id: string, data: Partial<LinksItem>): Promise<LinksItem> {
    const { data: updatedItem, error } = await put<LinksItem>(CONTENT_API_PATHS.Link(id), data);

    if (error) {
      throw new Error(error);
    }

    return updatedItem;
  }

  /**
   * 删除链接
   */
  async deleteLink(id: string): Promise<boolean> {
    const { data, error } = await del<{ success: boolean }>(CONTENT_API_PATHS.Link(id));

    if (error) {
      throw new Error(error);
    }

    return data.success;
  }
}

// 导出服务实例
export const linkDataService = new LinkDataServiceImpl();
