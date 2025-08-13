import { renderHook, act } from "@testing-library/react";
import { useModal } from "../use-modal";
import type { BlogPost } from "@/features/blog/types";

// Mock blog posts for testing
const mockPosts: BlogPost[] = [
  {
    slug: "test-post-1",
    title: "Test Post 1",
    description: "Test description 1",
    excerpt: "Test excerpt 1",
    category: "tech",
    tags: ["react", "typescript"],
    date: "2024-01-01",
  },
  {
    slug: "test-post-2",
    title: "Test Post 2",
    description: "Test description 2",
    excerpt: "Test excerpt 2",
    category: "life",
    tags: ["life", "thoughts"],
    date: "2024-01-02",
  },
];

describe("useModal", () => {
  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.modalState).toEqual({
      isOpen: false,
      title: "",
      posts: [],
      isLoading: false,
      error: undefined,
      selectedCategory: undefined,
      selectedTag: undefined,
      filterType: undefined,
    });
  });

  it("should open modal with generic openModal method", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal("Test Title", mockPosts);
    });

    expect(result.current.modalState).toEqual({
      isOpen: true,
      title: "Test Title",
      posts: mockPosts,
      isLoading: false,
      error: undefined,
      selectedCategory: undefined,
      selectedTag: undefined,
      filterType: undefined,
    });
  });

  it("should open category modal with correct state", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openCategoryModal("tech", mockPosts);
    });

    expect(result.current.modalState).toEqual({
      isOpen: true,
      title: "tech分类文章 (2篇)",
      posts: mockPosts,
      isLoading: false,
      error: undefined,
      selectedCategory: "tech",
      selectedTag: undefined,
      filterType: "category",
    });
  });

  it("should open tag modal with correct state", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openTagModal("react", mockPosts);
    });

    expect(result.current.modalState).toEqual({
      isOpen: true,
      title: "react标签文章 (2篇)",
      posts: mockPosts,
      isLoading: false,
      error: undefined,
      selectedCategory: undefined,
      selectedTag: "react",
      filterType: "tag",
    });
  });

  it("should close modal while preserving selection info", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openCategoryModal("tech", mockPosts);
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.modalState.isOpen).toBe(false);
    expect(result.current.modalState.selectedCategory).toBe("tech");
    expect(result.current.modalState.filterType).toBe("category");
  });

  it("should handle loading state correctly", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.modalState.isLoading).toBe(true);
    expect(result.current.modalState.error).toBeUndefined();

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.modalState.isLoading).toBe(false);
  });

  it("should handle error state correctly", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.setError("Test error message");
    });

    expect(result.current.modalState.error).toBe("Test error message");
    expect(result.current.modalState.isLoading).toBe(false);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.modalState.error).toBeUndefined();
  });

  it("should update posts and title correctly", () => {
    const { result } = renderHook(() => useModal());
    const newPosts = [mockPosts[0]];

    // First open a category modal
    act(() => {
      result.current.openCategoryModal("tech", mockPosts);
    });

    // Then update posts
    act(() => {
      result.current.updatePosts(newPosts);
    });

    expect(result.current.modalState.posts).toEqual(newPosts);
    expect(result.current.modalState.title).toBe("tech分类文章 (1篇)");
    expect(result.current.modalState.isLoading).toBe(false);
    expect(result.current.modalState.error).toBeUndefined();
  });

  it("should update title correctly for tag modal when updating posts", () => {
    const { result } = renderHook(() => useModal());
    const newPosts = [mockPosts[0]];

    // First open a tag modal
    act(() => {
      result.current.openTagModal("react", mockPosts);
    });

    // Then update posts
    act(() => {
      result.current.updatePosts(newPosts);
    });

    expect(result.current.modalState.posts).toEqual(newPosts);
    expect(result.current.modalState.title).toBe("react标签文章 (1篇)");
  });

  it("should clear error when starting to load", () => {
    const { result } = renderHook(() => useModal());

    // Set an error first
    act(() => {
      result.current.setError("Test error");
    });

    expect(result.current.modalState.error).toBe("Test error");

    // Start loading should clear the error
    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.modalState.error).toBeUndefined();
    expect(result.current.modalState.isLoading).toBe(true);
  });
});
