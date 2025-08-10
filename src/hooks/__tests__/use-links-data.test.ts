import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useLinksData } from "@/hooks/use-links-data";
import { LinksItem, LinksCategory } from "@/features/links/types";

// Mock the filter hook
vi.mock("@/hooks/filter/use-filter-state", () => ({
  useFilterState: vi.fn((items) => ({
    filteredItems: items,
    selectedCategory: "",
    selectedTag: null,
    handleCategoryChange: vi.fn(),
    handleTagChange: vi.fn(),
    filteredTags: [],
  })),
}));

// Mock the categories hook
vi.mock("@/hooks/use-categories", () => ({
  useCategories: vi.fn(() => ({
    categories: mockCategories,
    loading: false,
    error: null,
    getCategoryName: (categoryId: string) => {
      const category = mockCategories.find((cat) => cat.id === categoryId);
      return category?.name || categoryId;
    },
    getFilteredCategories: () =>
      mockCategories.filter(
        (cat) => cat.id !== "friends" && cat.id !== "profile",
      ),
  })),
}));

// Mock fetch
global.fetch = vi.fn();

const mockItems: LinksItem[] = [
  {
    id: "1",
    title: "Test Site 1",
    url: "https://test1.com",
    description: "Test description 1",
    category: "development",
    tags: ["javascript", "react"],
    icon: "test-icon",
    iconType: "image",
    featured: false,
  },
  {
    id: "2",
    title: "Friend Site",
    url: "https://friend.com",
    description: "Friend description",
    category: "friends",
    tags: ["personal"],
    icon: "friend-icon",
    iconType: "image",
    featured: false,
  },
  {
    id: "3",
    title: "Profile Site",
    url: "https://profile.com",
    description: "Profile description",
    category: "profile",
    tags: ["personal"],
    icon: "profile-icon",
    iconType: "image",
    featured: false,
  },
  {
    id: "4",
    title: "Test Site 2",
    url: "https://test2.com",
    description: "Test description 2",
    category: "design",
    tags: ["ui", "ux"],
    icon: "design-icon",
    iconType: "image",
    featured: false,
  },
];

const mockCategories: LinksCategory[] = [
  {
    id: "development",
    name: "开发工具",
    description: "编程开发相关工具和资源",
  },
  { id: "design", name: "设计资源", description: "设计工具和素材资源" },
  { id: "friends", name: "友情链接", description: "合作伙伴和友情链接" },
  { id: "profile", name: "个人主页", description: "入驻的平台和个人主页链接" },
];

describe("useLinksData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockImplementation((url: string) => {
      if (url.includes("/api/links/categories")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      if (url.includes("/api/links")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockItems),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
  });

  it("should filter out friends and profile categories from items", async () => {
    const { result } = renderHook(() => useLinksData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only include development and design items, excluding friends and profile
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items.map((item) => item.category)).toEqual(
      expect.arrayContaining(["development", "design"]),
    );
    expect(result.current.items.map((item) => item.category)).not.toContain(
      "friends",
    );
    expect(result.current.items.map((item) => item.category)).not.toContain(
      "profile",
    );
  });

  it("should filter out friends and profile categories from categories", async () => {
    const { result } = renderHook(() => useLinksData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only include development and design categories, excluding friends and profile
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.categories.map((cat) => cat.id)).toEqual(
      expect.arrayContaining(["development", "design"]),
    );
    expect(result.current.categories.map((cat) => cat.id)).not.toContain(
      "friends",
    );
    expect(result.current.categories.map((cat) => cat.id)).not.toContain(
      "profile",
    );
  });

  it("should calculate correct total filtered count", async () => {
    const { result } = renderHook(() => useLinksData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should count only non-friends/profile items
    expect(result.current.totalFilteredCount).toBe(2);
  });

  it("should handle getCategoryName correctly with filtered categories", async () => {
    const { result } = renderHook(() => useLinksData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.getCategoryName("development")).toBe("开发工具");
    expect(result.current.getCategoryName("design")).toBe("设计资源");
    // Should return the category name even for filtered categories
    expect(result.current.getCategoryName("friends")).toBe("友情链接");
    expect(result.current.getCategoryName("profile")).toBe("个人主页");
  });

  it("should handle loading and error states", async () => {
    const { result } = renderHook(() => useLinksData());

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
  });

  it("should handle fetch errors", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useLinksData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });
});
