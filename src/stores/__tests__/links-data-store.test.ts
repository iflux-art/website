import { useLinksDataStore } from "../links-data-store";

// Reset all stores before each test
beforeEach(() => {
  useLinksDataStore.getState().resetLinksDataState();
});

describe("useLinksDataStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useLinksDataStore.getState();

      expect(state.items).toEqual([]);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      // 检查派生状态
      expect(state.filteredItems).toEqual([]);
      expect(state.categoriesCount).toEqual({});
      expect(state.tagsCount).toEqual({});
    });
  });

  describe("Actions", () => {
    const mockItems = [
      {
        id: "1",
        title: "Test Link",
        description: "Test description",
        url: "https://example.com",
        icon: "icon",
        iconType: "image" as const,
        tags: ["tag1", "tag2"],
        featured: true,
        category: "development" as const, // 使用有效的 CategoryId 值
      },
      {
        id: "2",
        title: "Friends Link",
        description: "Friends description",
        url: "https://friends.com",
        icon: "icon",
        iconType: "image" as const,
        tags: ["tag2", "tag3"],
        featured: false,
        category: "friends" as const, // friends分类会被过滤掉
      },
    ];

    it("should set items and compute derived state", () => {
      const { setItems } = useLinksDataStore.getState();

      setItems(mockItems);
      expect(useLinksDataStore.getState().items).toEqual(mockItems);

      // 检查派生状态是否正确计算
      expect(useLinksDataStore.getState().filteredItems).toHaveLength(1);
      expect(useLinksDataStore.getState().filteredItems[0]).toEqual(mockItems[0]);

      expect(useLinksDataStore.getState().categoriesCount).toEqual({
        development: 1,
        friends: 1,
      });

      expect(useLinksDataStore.getState().tagsCount).toEqual({
        tag1: 1,
        tag2: 2, // 出现在两个链接中
        tag3: 1,
      });
    });

    it("should set loading state", () => {
      const { setLoading } = useLinksDataStore.getState();

      setLoading(false);
      expect(useLinksDataStore.getState().loading).toBe(false);
    });

    it("should set error", () => {
      const { setError } = useLinksDataStore.getState();
      const errorMessage = "Failed to load data";

      setError(errorMessage);
      expect(useLinksDataStore.getState().error).toBe(errorMessage);
    });

    it("should reset state", () => {
      const state = useLinksDataStore.getState();

      // Change states
      state.setItems(mockItems);
      state.setLoading(false);
      state.setError("Error");

      // Reset
      state.resetLinksDataState();

      // Check reset state
      expect(useLinksDataStore.getState().items).toEqual([]);
      expect(useLinksDataStore.getState().loading).toBe(true);
      expect(useLinksDataStore.getState().error).toBeNull();
      // 检查派生状态也被重置
      expect(useLinksDataStore.getState().filteredItems).toEqual([]);
      expect(useLinksDataStore.getState().categoriesCount).toEqual({});
      expect(useLinksDataStore.getState().tagsCount).toEqual({});
    });
  });

  describe("Derived State", () => {
    const mockItems = [
      {
        id: "1",
        title: "Test Link 1",
        description: "Test description 1",
        url: "https://example1.com",
        icon: "icon1",
        iconType: "image" as const,
        tags: ["tag1", "tag2"],
        featured: true,
        category: "development" as const,
      },
      {
        id: "2",
        title: "Test Link 2",
        description: "Test description 2",
        url: "https://example2.com",
        icon: "icon2",
        iconType: "image" as const,
        tags: ["tag2", "tag3"],
        featured: false,
        category: "development" as const, // 改为有效的 CategoryId 值
      },
      {
        id: "3",
        title: "Friends Link",
        description: "Friends description",
        url: "https://friends.com",
        icon: "icon3",
        iconType: "image" as const,
        tags: ["tag3", "tag4"],
        featured: false,
        category: "friends" as const,
      },
    ];

    beforeEach(() => {
      useLinksDataStore.getState().setItems(mockItems);
    });

    it("should compute filteredItems correctly", () => {
      const state = useLinksDataStore.getState();
      // friends分类的链接应该被过滤掉
      expect(state.filteredItems).toHaveLength(2);
      expect(state.filteredItems).toEqual([
        expect.objectContaining({ id: "1", category: "development" }),
        expect.objectContaining({ id: "2", category: "development" }),
      ]);
    });

    it("should compute categoriesCount correctly", () => {
      const state = useLinksDataStore.getState();
      expect(state.categoriesCount).toEqual({
        development: 2,
        friends: 1,
      });
    });

    it("should compute tagsCount correctly", () => {
      const state = useLinksDataStore.getState();
      expect(state.tagsCount).toEqual({
        tag1: 1,
        tag2: 2, // 出现在两个链接中
        tag3: 2, // 出现在两个链接中
        tag4: 1,
      });
    });
  });
});
