/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLinksDataState } from "../use-links-data-state";

// Mock the store
const mockSetItems = vi.fn();
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();

const mockStore: {
  items: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    icon: string;
    iconType: "image" | "text" | undefined;
    tags: string[];
    featured: boolean;
    category: string;
  }>;
  loading: boolean;
  error: null | string;
  setItems: typeof mockSetItems;
  setLoading: typeof mockSetLoading;
  setError: typeof mockSetError;
} = {
  items: [],
  loading: true,
  error: null,
  setItems: mockSetItems,
  setLoading: mockSetLoading,
  setError: mockSetError,
};

vi.mock("@/stores", () => ({
  useLinksDataStore: () => mockStore,
}));

// Mock loadAllLinksData
const mockLoadAllLinksData = vi.fn();
vi.mock("@/features/links/lib", () => ({
  loadAllLinksData: () => mockLoadAllLinksData(),
}));

// Mock useCategories
const mockGetCategoryName = vi.fn();
const mockGetFilteredCategories = vi.fn();

vi.mock("../use-categories", () => ({
  useCategories: () => ({
    getCategoryName: mockGetCategoryName,
    getFilteredCategories: mockGetFilteredCategories,
  }),
}));

// Mock useFilterState
const mockHandleTagChange = vi.fn();
const mockHandleCategoryChange = vi.fn();

vi.mock("../use-filter-state", () => ({
  useFilterState: () => ({
    filteredItems: [],
    selectedCategory: "",
    selectedTag: "",
    handleTagChange: mockHandleTagChange,
    handleCategoryChange: mockHandleCategoryChange,
    filteredTags: [],
  }),
}));

describe("useLinksDataState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    mockGetFilteredCategories.mockReturnValue([]);

    const { result } = renderHook(() => useLinksDataState());

    // 使用 result 变量来避免 TS6133 错误
    expect(result.current.items).toEqual([]);
    expect(result.current.allItems).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should load links data on mount", async () => {
    const mockItems = [
      {
        id: "1",
        title: "Test Link",
        description: "Test description",
        url: "https://example.com",
        icon: "icon",
        iconType: "image" as const,
        tags: [],
        featured: true,
        category: "test",
      },
    ];

    mockLoadAllLinksData.mockResolvedValueOnce(mockItems);
    mockGetFilteredCategories.mockReturnValue([]);

    const { result } = renderHook(() => useLinksDataState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockLoadAllLinksData).toHaveBeenCalled();
    expect(mockSetItems).toHaveBeenCalledWith(mockItems);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should handle load error", async () => {
    mockLoadAllLinksData.mockRejectedValueOnce(new Error("Failed to load"));
    mockGetFilteredCategories.mockReturnValue([]);

    const { result } = renderHook(() => useLinksDataState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetError).toHaveBeenCalledWith("Failed to load");
  });

  it("should filter out friends and profile categories", () => {
    mockStore.items = [
      {
        id: "1",
        title: "Test Link",
        description: "Test description",
        url: "https://example.com",
        icon: "icon",
        iconType: "image" as const,
        tags: [],
        featured: true,
        category: "test",
      },
      {
        id: "2",
        title: "Friend Link",
        description: "Friend description",
        url: "https://friend.com",
        icon: "icon",
        iconType: "image" as const,
        tags: [],
        featured: true,
        category: "friends",
      },
      {
        id: "3",
        title: "Profile Link",
        description: "Profile description",
        url: "https://profile.com",
        icon: "icon",
        iconType: "image" as const,
        tags: [],
        featured: true,
        category: "profile",
      },
    ];

    mockGetFilteredCategories.mockReturnValue([]);

    const { result } = renderHook(() => useLinksDataState());

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].category).toBe("test");
  });

  it("should handle category click", () => {
    mockGetFilteredCategories.mockReturnValue([]);

    const { result } = renderHook(() => useLinksDataState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    act(() => {
      result.current.handleCategoryClick("test-category");
    });

    expect(mockHandleCategoryChange).toHaveBeenCalledWith("test-category");
  });

  it("should handle tag click", () => {
    mockGetFilteredCategories.mockReturnValue([]);

    const { result } = renderHook(() => useLinksDataState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    act(() => {
      result.current.handleTagClick("test-tag");
    });

    expect(mockHandleTagChange).toHaveBeenCalledWith("test-tag");
  });
});
