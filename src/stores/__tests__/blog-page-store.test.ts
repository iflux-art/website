import { useBlogPageStore } from "../blog-page-store";

// Reset all stores before each test
beforeEach(() => {
  useBlogPageStore.getState().resetBlogPageState();
});

describe("useBlogPageStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useBlogPageStore.getState();

      expect(state.posts).toEqual([]);
      expect(state.loading).toBe(true);
      expect(state.category).toBeUndefined();
      expect(state.tag).toBeUndefined();
    });
  });

  describe("Actions", () => {
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

    it("should set posts", () => {
      const { setPosts } = useBlogPageStore.getState();

      setPosts(mockPosts);
      expect(useBlogPageStore.getState().posts).toEqual(mockPosts);
    });

    it("should set loading state", () => {
      const { setLoading } = useBlogPageStore.getState();

      setLoading(false);
      expect(useBlogPageStore.getState().loading).toBe(false);
    });

    it("should set category", () => {
      const { setCategory } = useBlogPageStore.getState();
      const category = "test-category";

      setCategory(category);
      expect(useBlogPageStore.getState().category).toBe(category);
    });

    it("should set tag", () => {
      const { setTag } = useBlogPageStore.getState();
      const tag = "test-tag";

      setTag(tag);
      expect(useBlogPageStore.getState().tag).toBe(tag);
    });

    it("should reset state", () => {
      const state = useBlogPageStore.getState();

      // Change states
      state.setPosts(mockPosts);
      state.setLoading(false);
      state.setCategory("test");
      state.setTag("tag");

      // Reset
      state.resetBlogPageState();

      // Check reset state
      expect(useBlogPageStore.getState().posts).toEqual([]);
      expect(useBlogPageStore.getState().loading).toBe(true);
      expect(useBlogPageStore.getState().category).toBeUndefined();
      expect(useBlogPageStore.getState().tag).toBeUndefined();
    });
  });
});
