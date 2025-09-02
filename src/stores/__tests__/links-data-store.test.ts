import { useLinksDataStore } from "../links-data-store.standard";

// Reset all stores before each test
beforeEach(() => {
  useLinksDataStore.getState().resetState();
});

describe("useLinksDataStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useLinksDataStore.getState();

      expect(state.items).toEqual([]);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
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

    it("should set items", () => {
      const { setItems } = useLinksDataStore.getState();

      setItems(mockItems);
      expect(useLinksDataStore.getState().items).toEqual(mockItems);
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
      state.resetState();

      // Check reset state
      expect(useLinksDataStore.getState().items).toEqual([]);
      expect(useLinksDataStore.getState().loading).toBe(true);
      expect(useLinksDataStore.getState().error).toBeNull();
    });
  });
});
