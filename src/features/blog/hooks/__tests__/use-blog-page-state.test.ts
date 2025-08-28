/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBlogPageState } from "../use-blog-page-state";

// Mock useRouter and useSearchParams
const mockPush = vi.fn();
const mockSearchParams = {
  entries: () => [],
  toString: () => "",
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock the store
const mockSetPosts = vi.fn();
const mockSetLoading = vi.fn();
const mockSetCategory = vi.fn();
const mockSetTag = vi.fn();
const mockResetBlogPageState = vi.fn();

const mockStore: {
  posts: Array<{
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    description: string;
    excerpt: string;
  }>;
  loading: boolean;
  category: string | undefined;
  tag: string | undefined;
  setPosts: typeof mockSetPosts;
  setLoading: typeof mockSetLoading;
  setCategory: typeof mockSetCategory;
  setTag: typeof mockSetTag;
  resetBlogPageState: typeof mockResetBlogPageState;
} = {
  posts: [],
  loading: true,
  category: undefined,
  tag: undefined,
  setPosts: mockSetPosts,
  setLoading: mockSetLoading,
  setCategory: mockSetCategory,
  setTag: mockSetTag,
  resetBlogPageState: mockResetBlogPageState,
};

vi.mock("@/stores", () => ({
  useBlogPageStore: () => mockStore,
}));

// Mock getAllPosts
const mockGetAllPosts = vi.fn();
vi.mock("@/features/blog/hooks/index", () => ({
  getAllPosts: () => mockGetAllPosts(),
}));

describe("useBlogPageState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useBlogPageState());

    // 使用 result 变量来避免 TS6133 错误
    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.category).toBeUndefined();
    expect(result.current.tag).toBeUndefined();
  });

  it("should load posts on mount", async () => {
    const mockPosts = [
      {
        slug: "test-post",
        title: "Test Post",
        date: "2023-01-01",
        category: "test",
        tags: ["tag1", "tag2"],
        description: "Test description",
        excerpt: "Test excerpt",
      },
    ];

    mockGetAllPosts.mockResolvedValueOnce(mockPosts);

    const { result } = renderHook(() => useBlogPageState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockGetAllPosts).toHaveBeenCalled();
    expect(mockSetPosts).toHaveBeenCalledWith(mockPosts);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should handle category click", () => {
    const { result } = renderHook(() => useBlogPageState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    act(() => {
      result.current.handleCategoryClick("test-category");
    });

    expect(mockSetCategory).toHaveBeenCalledWith("test-category");
    expect(mockPush).toHaveBeenCalled();
  });

  it("should handle tag click", () => {
    const { result } = renderHook(() => useBlogPageState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    act(() => {
      result.current.handleTagClick("test-tag");
    });

    expect(mockSetTag).toHaveBeenCalledWith("test-tag");
    expect(mockPush).toHaveBeenCalled();
  });

  it("should filter posts by category", () => {
    mockStore.posts = [
      {
        slug: "test-post-1",
        title: "Test Post 1",
        date: "2023-01-01",
        category: "test",
        tags: ["tag1"],
        description: "Test description",
        excerpt: "Test excerpt",
      },
      {
        slug: "test-post-2",
        title: "Test Post 2",
        date: "2023-01-02",
        category: "other",
        tags: ["tag2"],
        description: "Test description",
        excerpt: "Test excerpt",
      },
    ];

    mockStore.category = "test";

    const { result } = renderHook(() => useBlogPageState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    expect(result.current.filteredPosts).toHaveLength(1);
    // 修复：添加边界检查
    if (result.current.filteredPosts.length > 0 && result.current.filteredPosts[0]) {
      expect(result.current.filteredPosts[0].category).toBe("test");
    }
  });

  it("should filter posts by tag", () => {
    mockStore.posts = [
      {
        slug: "test-post-1",
        title: "Test Post 1",
        date: "2023-01-01",
        category: "test",
        tags: ["tag1", "tag2"],
        description: "Test description",
        excerpt: "Test excerpt",
      },
      {
        slug: "test-post-2",
        title: "Test Post 2",
        date: "2023-01-02",
        category: "other",
        tags: ["tag3"],
        description: "Test description",
        excerpt: "Test excerpt",
      },
    ];

    mockStore.tag = "tag1";

    const { result } = renderHook(() => useBlogPageState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    expect(result.current.filteredPosts).toHaveLength(1);
    // 修复：添加边界检查
    if (result.current.filteredPosts.length > 0 && result.current.filteredPosts[0]) {
      expect(result.current.filteredPosts[0].tags).toContain("tag1");
    }
  });
});
