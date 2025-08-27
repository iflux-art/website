/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFilterState } from "../use-filter-state";

// Mock the store
const mockSetFilteredItems = vi.fn();
const mockSetAvailableTags = vi.fn();
const mockSetSelectedCategory = vi.fn();
const mockSetSelectedTag = vi.fn();
const mockResetFilters = vi.fn();

const mockStore = {
  selectedCategory: "",
  selectedTag: "",
  filteredItems: [],
  availableTags: [],
  setSelectedCategory: mockSetSelectedCategory,
  setSelectedTag: mockSetSelectedTag,
  setFilteredItems: mockSetFilteredItems,
  setAvailableTags: mockSetAvailableTags,
  resetFilters: mockResetFilters,
};

vi.mock("@/stores", () => ({
  useLinkFilterStore: () => mockStore,
}));

describe("useFilterState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle category change", () => {
    const { result } = renderHook(() => useFilterState([]));

    act(() => {
      result.current.handleCategoryChange("test-category");
    });

    expect(mockSetSelectedCategory).toHaveBeenCalledWith("test-category");
    expect(mockSetSelectedTag).toHaveBeenCalledWith("");
  });

  it("should handle tag change", () => {
    const { result } = renderHook(() => useFilterState([]));

    // First call to select tag
    act(() => {
      result.current.handleTagChange("test-tag");
    });

    expect(mockSetSelectedTag).toHaveBeenCalledWith("test-tag");

    // Reset mock to test toggle
    mockSetSelectedTag.mockClear();

    // Second call with same tag to deselect
    act(() => {
      result.current.handleTagChange("test-tag");
    });

    expect(mockSetSelectedTag).toHaveBeenCalledWith("");
  });

  it("should update filtered items when items change", async () => {
    const testItems = [
      {
        id: "1",
        title: "Item 1",
        category: "ai" as const,
        url: "https://example.com",
        description: "Test item 1",
        icon: "icon1",
        iconType: "image" as const,
        tags: [],
        featured: false,
      },
      {
        id: "2",
        title: "Item 2",
        category: "ai" as const,
        url: "https://example.com",
        description: "Test item 2",
        icon: "icon2",
        iconType: "image" as const,
        tags: [],
        featured: false,
      },
    ];

    renderHook(() => useFilterState(testItems));

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetFilteredItems).toHaveBeenCalledWith(testItems);
  });

  it("should update available tags", async () => {
    const testItems = [
      {
        id: "1",
        title: "Item 1",
        category: "ai" as const,
        tags: ["tag1", "tag2"],
        url: "https://example.com",
        description: "Test item 1",
        icon: "icon1",
        iconType: "image" as const,
        featured: false,
      },
      {
        id: "2",
        title: "Item 2",
        category: "ai" as const,
        tags: ["tag2", "tag3"],
        url: "https://example.com",
        description: "Test item 2",
        icon: "icon2",
        iconType: "image" as const,
        featured: false,
      },
    ];

    renderHook(() => useFilterState(testItems));

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetAvailableTags).toHaveBeenCalledWith(["tag1", "tag2", "tag3"]);
  });
});
