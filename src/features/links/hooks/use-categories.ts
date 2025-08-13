import { useState, useEffect } from "react";
import { LinksCategory, CategoryId } from "../types";
import { generateCategoriesData } from "../lib";

/**
 * 获取链接分类数据的 Hook
 * 提供统一的分类数据管理，避免重复请求
 */
export function useCategories() {
  const [categories, setCategories] = useState<LinksCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        // 直接使用生成的分类数据
        const data = generateCategoriesData();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  /**
   * 根据分类 ID 获取分类名称（支持子分类）
   */
  const getCategoryName = (categoryId: string) => {
    // 先查找主分类
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      return category.name;
    }

    // 查找子分类
    for (const cat of categories) {
      if (cat.children) {
        const subCategory = cat.children.find((sub) => sub.id === categoryId);
        if (subCategory) {
          return `${cat.name} > ${subCategory.name}`;
        }
      }
    }

    return categoryId;
  };

  /**
   * 获取过滤后的分类（排除友链和个人主页）
   */
  const getFilteredCategories = () => {
    return categories.filter(
      (cat) => cat.id !== "friends" && cat.id !== "profile",
    );
  };

  /**
   * 获取扁平化的分类列表（包含子分类）
   */
  const getFlatCategories = () => {
    const flatCategories: Array<{
      id: CategoryId;
      name: string;
      isSubCategory: boolean;
      parentName?: string;
    }> = [];

    categories.forEach((category) => {
      // 添加主分类
      flatCategories.push({
        id: category.id,
        name: category.name,
        isSubCategory: false,
      });

      // 添加子分类
      if (category.children) {
        category.children.forEach((subCategory) => {
          flatCategories.push({
            id: subCategory.id,
            name: subCategory.name,
            isSubCategory: true,
            parentName: category.name,
          });
        });
      }
    });

    return flatCategories;
  };

  /**
   * 重新加载分类数据
   */
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/links/categories", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    getCategoryName,
    getFilteredCategories,
    getFlatCategories,
    refetch,
  };
}
