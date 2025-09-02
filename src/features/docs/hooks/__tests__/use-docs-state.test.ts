import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocCategory, DocItem } from "@/features/docs/types";
import { useDocsState } from "../use-docs-state";

// Mock 数据
const mockCategories: DocCategory[] = [
  {
    id: "getting-started",
    name: "getting-started",
    title: "Getting Started",
    slug: "getting-started",
    description: "入门指南",
    count: 5,
  },
  {
    id: "api",
    name: "api",
    title: "API",
    slug: "api",
    description: "API 文档",
    count: 12,
  },
];

const mockDoc: DocItem = {
  title: "文档标题",
  content: "# 文档标题\n\n这是文档内容。",
  frontmatter: {
    title: "文档标题",
    description: "文档描述",
  },
  headings: [],
};

describe("useDocsState", () => {
  beforeEach(() => {
    // 重置所有 mocks
    vi.resetAllMocks();
  });

  it("应该返回初始状态", () => {
    const { result } = renderHook(() => useDocsState());

    expect(result.current.categories).toEqual([]);
    expect(result.current.currentDoc).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedCategory).toBeNull();
  });

  it("应该能够设置文档分类", () => {
    const { result } = renderHook(() => useDocsState());

    // 设置分类
    act(() => {
      result.current.setCategories(mockCategories);
    });

    // 验证状态更新
    expect(result.current.categories).toEqual(mockCategories);
  });

  it("应该能够设置当前文档", () => {
    const { result } = renderHook(() => useDocsState());

    // 设置当前文档
    act(() => {
      result.current.setCurrentDoc(mockDoc);
    });

    // 验证状态更新
    expect(result.current.currentDoc).toEqual(mockDoc);
  });

  it("应该能够设置加载状态", () => {
    const { result } = renderHook(() => useDocsState());

    // 设置加载状态
    act(() => {
      result.current.setLoading(true);
    });

    // 验证状态更新
    expect(result.current.loading).toBe(true);
  });

  it("应该能够设置错误状态", () => {
    const { result } = renderHook(() => useDocsState());

    // 设置错误状态
    act(() => {
      result.current.setError("加载失败");
    });

    // 验证状态更新
    expect(result.current.error).toBe("加载失败");
  });

  it("应该能够选择分类", () => {
    const { result } = renderHook(() => useDocsState());

    // 选择分类
    act(() => {
      result.current.selectCategory("api");
    });

    // 验证状态更新
    expect(result.current.selectedCategory).toBe("api");
  });

  it("应该能够重置状态", () => {
    const { result } = renderHook(() => useDocsState());

    // 设置一些状态
    act(() => {
      result.current.setCategories(mockCategories);
      result.current.setCurrentDoc(mockDoc);
      result.current.setLoading(true);
      result.current.setError("错误信息");
      result.current.setSelectedCategory("api");
    });

    // 重置状态
    act(() => {
      result.current.resetState();
    });

    // 验证状态重置
    expect(result.current.categories).toEqual([]);
    expect(result.current.currentDoc).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedCategory).toBeNull();
  });
});
