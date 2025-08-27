import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SearchResult } from "@/features/search/types";
import { useSearchState } from "../use-search-state";

// Mock 搜索引擎函数
const mockPerformSearch = vi.fn();
const mockGetSearchSuggestions = vi.fn();

// Mock 模块
vi.mock("@/features/search/lib/search-engine", () => ({
  performSearch: mockPerformSearch,
  getSearchSuggestions: mockGetSearchSuggestions,
}));

// Mock 数据
const mockResults: SearchResult[] = [
  {
    title: "React",
    description: "A JavaScript library for building user interfaces",
    type: "link",
    url: "https://reactjs.org",
  },
  {
    title: "Vue",
    description: "The Progressive JavaScript Framework",
    type: "link",
    url: "https://vuejs.org",
  },
];

describe("useSearchState", () => {
  beforeEach(() => {
    // 重置所有 mocks
    vi.resetAllMocks();
  });

  it("应该返回初始状态", () => {
    const { result } = renderHook(() => useSearchState());

    // Zustand 状态
    expect(result.current.searchTerm).toBe("");
    expect(result.current.selectedCategory).toBe("");

    // 本地状态
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.query).toBe("");
    expect(result.current.suggestions).toEqual([]);
  });

  it("应该能够执行搜索", async () => {
    // Mock 搜索结果
    mockPerformSearch.mockResolvedValue({ results: mockResults });

    const { result } = renderHook(() => useSearchState());

    // 执行搜索
    await act(async () => {
      await result.current.search("react");
    });

    // 验证状态更新
    expect(result.current.searchTerm).toBe("react");
    expect(result.current.query).toBe("react");
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // 验证调用了搜索函数
    expect(mockPerformSearch).toHaveBeenCalledWith("react", undefined);
  });

  it("应该在搜索失败时处理错误", async () => {
    // Mock 搜索失败
    mockPerformSearch.mockRejectedValue(new Error("Search failed"));

    const { result } = renderHook(() => useSearchState());

    // 执行搜索
    await act(async () => {
      await result.current.search("react");
    });

    // 验证错误状态
    expect(result.current.searchTerm).toBe("react");
    expect(result.current.query).toBe("react");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Search failed");
  });

  it("应该能够获取搜索建议", async () => {
    // Mock 建议结果
    const suggestions = ["react", "react native", "react router"];
    mockGetSearchSuggestions.mockResolvedValue(suggestions);

    const { result } = renderHook(() => useSearchState());

    // 获取建议
    await act(async () => {
      await result.current.getSuggestions("react");
    });

    // 验证建议更新
    expect(result.current.suggestions).toEqual(suggestions);

    // 验证调用了获取建议函数
    expect(mockGetSearchSuggestions).toHaveBeenCalledWith("react");
  });

  it("应该在获取建议失败时处理错误", async () => {
    // Mock 建议获取失败
    mockGetSearchSuggestions.mockRejectedValue(new Error("Failed to get suggestions"));

    const { result } = renderHook(() => useSearchState());

    // 获取建议
    await act(async () => {
      await result.current.getSuggestions("react");
    });

    // 验证建议为空
    expect(result.current.suggestions).toEqual([]);
  });

  it("应该能够更新搜索词", () => {
    const { result } = renderHook(() => useSearchState());

    // 更新搜索词
    act(() => {
      result.current.setSearchTerm("vue");
    });

    // 验证状态更新
    expect(result.current.searchTerm).toBe("vue");
    expect(result.current.query).toBe("vue");
  });

  it("应该能够更新选中的分类", () => {
    const { result } = renderHook(() => useSearchState());

    // 更新选中的分类
    act(() => {
      result.current.setSelectedCategory("framework");
    });

    // 验证状态更新
    expect(result.current.selectedCategory).toBe("framework");
  });

  it("应该能够重置搜索", () => {
    const { result } = renderHook(() => useSearchState());

    // 设置一些状态
    act(() => {
      result.current.setSearchTerm("react");
      result.current.setSelectedCategory("framework");
    });

    // 重置搜索
    act(() => {
      result.current.resetSearch();
    });

    // 验证状态重置
    expect(result.current.searchTerm).toBe("");
    expect(result.current.selectedCategory).toBe("");
  });
});
