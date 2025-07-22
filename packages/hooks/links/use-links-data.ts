import { useState, useEffect } from "react";
import { useFilterState } from "packages/hooks/state/use-filter-state";
import { LinksItem, LinksCategory } from "packages/types/links/links-types";

export function useLinksData() {
  const [items, setItems] = useState<LinksItem[]>([]);
  const [categories, setCategories] = useState<LinksCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 并行获取数据
        const [itemsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/links"),
          fetch("/api/links/categories"),
        ]);

        if (!itemsResponse.ok) {
          throw new Error("Failed to fetch links");
        }
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const itemsData = await itemsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setItems(Array.isArray(itemsData) ? itemsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const {
    filteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange: handleTagClick,
    handleCategoryChange,
    filteredTags: sortedTags,
  } = useFilterState(items);

  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return {
    items,
    categories,
    selectedCategory,
    selectedTag,
    filteredItems,
    sortedTags,
    loading,
    error,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
  };
}
