import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTagAnchors } from "../use-tag-anchors";
import { LinksItem } from "../../types";

describe("useTagAnchors", () => {
  it("should return empty array when no items provided", () => {
    const { result } = renderHook(() => useTagAnchors([]));
    expect(result.current).toEqual([]);
  });

  it("should extract unique tags from items", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test 1",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["前端", "工具"],
        featured: false,
        category: "development",
      },
      {
        id: "2",
        title: "Test 2",
        description: "Test description",
        url: "https://example2.com",
        icon: "",
        iconType: "text",
        tags: ["前端", "框架"],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    expect(result.current).toHaveLength(3);
    expect(result.current.map((anchor) => anchor.text)).toEqual([
      "工具",
      "框架",
      "前端",
    ]);
  });

  it("should generate correct anchor IDs", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["前端开发", "AI 工具"],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    expect(result.current[0].id).toBe("tag-前端开发");
    expect(result.current[1].id).toBe("tag-ai-工具");
  });

  it("should set level to 2 for all anchors", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["前端", "后端"],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    result.current.forEach((anchor) => {
      expect(anchor.level).toBe(2);
    });
  });

  it("should sort tags alphabetically in Chinese", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["工具", "AI", "前端", "后端"],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    expect(result.current.map((anchor) => anchor.text)).toEqual([
      "工具",
      "后端",
      "前端",
      "AI",
    ]);
  });

  it("should handle empty tags array", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: [],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));
    expect(result.current).toEqual([]);
  });

  it("should handle undefined tags", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: undefined as any,
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));
    expect(result.current).toEqual([]);
  });

  it("should trim whitespace from tags", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["  前端  ", " 工具 "],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    expect(result.current.map((anchor) => anchor.text)).toEqual([
      "工具",
      "前端",
    ]);
  });

  it("should filter out empty or invalid tags", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["前端", "", "   ", null as any, undefined as any, "工具"],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    expect(result.current.map((anchor) => anchor.text)).toEqual([
      "工具",
      "前端",
    ]);
  });

  it("should deduplicate tags across multiple items", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test 1",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["前端", "工具"],
        featured: false,
        category: "development",
      },
      {
        id: "2",
        title: "Test 2",
        description: "Test description",
        url: "https://example2.com",
        icon: "",
        iconType: "text",
        tags: ["前端", "框架"],
        featured: false,
        category: "development",
      },
      {
        id: "3",
        title: "Test 3",
        description: "Test description",
        url: "https://example3.com",
        icon: "",
        iconType: "text",
        tags: ["工具", "AI"],
        featured: false,
        category: "ai",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    // Should have 4 unique tags: AI, 前端, 工具, 框架
    expect(result.current).toHaveLength(4);
    expect(result.current.map((anchor) => anchor.text)).toEqual([
      "工具",
      "框架",
      "前端",
      "AI",
    ]);
  });

  it("should handle complex tag names with special characters", () => {
    const items: LinksItem[] = [
      {
        id: "1",
        title: "Test",
        description: "Test description",
        url: "https://example.com",
        icon: "",
        iconType: "text",
        tags: ["Vue.js", "Node.js", "C++", "AI/ML"],
        featured: false,
        category: "development",
      },
    ];

    const { result } = renderHook(() => useTagAnchors(items));

    expect(result.current[0].text).toBe("AI/ML");
    expect(result.current[0].id).toBe("tag-ai/ml");
    expect(result.current[1].text).toBe("C++");
    expect(result.current[1].id).toBe("tag-c++");
  });
});
