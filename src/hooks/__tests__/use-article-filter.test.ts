/**
 * useArticleFilter Hook 测试
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useArticleFilter } from "../use-article-filter";
import type { BlogPost } from "@/features/blog/types";

// 模拟测试数据
const mockPosts: BlogPost[] = [
  {
    slug: "post-1",
    title: "React 入门教程",
    description: "React 基础知识介绍",
    excerpt: "React 基础知识介绍",
    date: "2024-01-15",
    category: "技术",
    tags: ["React", "JavaScript", "前端"],
    views: 100,
  },
  {
    slug: "post-2",
    title: "Vue 3 新特性",
    description: "Vue 3 的新功能详解",
    excerpt: "Vue 3 的新功能详解",
    date: "2024-01-10",
    category: "技术",
    tags: ["Vue", "JavaScript", "前端"],
    views: 80,
  },
  {
    slug: "post-3",
    title: "生活随笔",
    description: "日常生活感悟",
    excerpt: "日常生活感悟",
    date: "2024-01-05",
    category: "生活",
    tags: ["随笔", "生活"],
    views: 50,
  },
  {
    slug: "post-4",
    title: "Node.js 后端开发",
    description: "Node.js 服务端开发指南",
    excerpt: "Node.js 服务端开发指南",
    date: "2024-01-20",
    category: "技术",
    tags: ["Node.js", "JavaScript", "后端"],
    views: 120,
  },
];

describe("useArticleFilter", () => {
  beforeEach(() => {
    // 清理缓存
    vi.clearAllMocks();
  });

  describe("filterByCategory", () => {
    it("应该正确按分类筛选文章", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory(mockPosts, "技术");

        expect(filterResult.posts).toHaveLength(3);
        expect(filterResult.totalCount).toBe(3);
        expect(filterResult.isLoading).toBe(false);
        expect(filterResult.error).toBeNull();

        // 验证筛选结果
        filterResult.posts.forEach((post) => {
          expect(post.category).toBe("技术");
        });
      });
    });

    it("应该按日期降序排序", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory(mockPosts, "技术");

        expect(filterResult.posts[0].slug).toBe("post-4"); // 2024-01-20
        expect(filterResult.posts[1].slug).toBe("post-1"); // 2024-01-15
        expect(filterResult.posts[2].slug).toBe("post-2"); // 2024-01-10
      });
    });

    it("应该支持自定义排序选项", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory(
          mockPosts,
          "技术",
          { sortBy: "views", sortOrder: "desc" },
        );

        expect(filterResult.posts[0].views).toBe(120); // post-4
        expect(filterResult.posts[1].views).toBe(100); // post-1
        expect(filterResult.posts[2].views).toBe(80); // post-2
      });
    });

    it("应该支持分页", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory(
          mockPosts,
          "技术",
          { limit: 2, offset: 0 },
        );

        expect(filterResult.posts).toHaveLength(2);
        expect(filterResult.totalCount).toBe(3); // 总数不变
      });
    });

    it("当分类不存在时应该返回空结果", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory(
          mockPosts,
          "不存在的分类",
        );

        expect(filterResult.posts).toHaveLength(0);
        expect(filterResult.totalCount).toBe(0);
        expect(filterResult.error).toBeNull();
      });
    });
  });

  describe("filterByTag", () => {
    it("应该正确按标签筛选文章", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByTag(
          mockPosts,
          "JavaScript",
        );

        expect(filterResult.posts).toHaveLength(3);
        expect(filterResult.totalCount).toBe(3);

        // 验证筛选结果
        filterResult.posts.forEach((post) => {
          expect(post.tags).toContain("JavaScript");
        });
      });
    });

    it("当标签不存在时应该返回空结果", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByTag(
          mockPosts,
          "不存在的标签",
        );

        expect(filterResult.posts).toHaveLength(0);
        expect(filterResult.totalCount).toBe(0);
      });
    });
  });

  describe("filterByMultipleTags", () => {
    it("应该正确按多个标签筛选文章", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByMultipleTags(mockPosts, [
          "JavaScript",
          "前端",
        ]);

        expect(filterResult.posts).toHaveLength(2); // post-1 和 post-2

        // 验证筛选结果包含所有指定标签
        filterResult.posts.forEach((post) => {
          expect(post.tags).toContain("JavaScript");
          expect(post.tags).toContain("前端");
        });
      });
    });

    it("当没有文章包含所有标签时应该返回空结果", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByMultipleTags(
          mockPosts,
          ["React", "Vue"], // 没有文章同时包含这两个标签
        );

        expect(filterResult.posts).toHaveLength(0);
        expect(filterResult.totalCount).toBe(0);
      });
    });
  });

  describe("缓存功能", () => {
    it("应该缓存筛选结果", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        // 第一次调用
        const filterResult1 = result.current.filterByCategory(
          mockPosts,
          "技术",
        );
        expect(filterResult1.posts).toHaveLength(3);

        // 第二次调用相同参数，应该从缓存返回（结果应该相同）
        const filterResult2 = result.current.filterByCategory(
          mockPosts,
          "技术",
        );
        expect(filterResult2.posts).toHaveLength(3);

        // 验证结果一致性
        expect(filterResult1.posts[0].slug).toBe(filterResult2.posts[0].slug);
      });
    });

    it("应该能够清除缓存", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        // 先进行一次筛选以创建缓存
        const filterResult1 = result.current.filterByCategory(
          mockPosts,
          "技术",
        );
        expect(filterResult1.posts).toHaveLength(3);

        // 清除缓存
        result.current.clearCache();

        // 再次筛选应该仍然工作
        const filterResult2 = result.current.filterByCategory(
          mockPosts,
          "技术",
        );
        expect(filterResult2.posts).toHaveLength(3);
      });
    });
  });

  describe("错误处理", () => {
    it("应该处理空的文章列表", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory([], "技术");

        expect(filterResult.posts).toHaveLength(0);
        expect(filterResult.totalCount).toBe(0);
        expect(filterResult.error).toBeNull();
      });
    });

    it("应该处理空的筛选条件", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        const filterResult = result.current.filterByCategory(mockPosts, "");

        expect(filterResult.posts).toHaveLength(0);
        expect(filterResult.totalCount).toBe(0);
        expect(filterResult.error).toBeNull();
      });
    });
  });

  describe("性能优化", () => {
    it("应该提供缓存统计信息", () => {
      const { result } = renderHook(() => useArticleFilter());

      act(() => {
        // 验证缓存统计对象存在
        expect(result.current.cacheStats).toBeDefined();
        expect(typeof result.current.cacheStats.size).toBe("number");
        expect(typeof result.current.cacheStats.hitRate).toBe("number");

        // 初始状态
        expect(result.current.cacheStats.size).toBe(0);
        expect(result.current.cacheStats.hitRate).toBe(0);
      });
    });
  });
});
