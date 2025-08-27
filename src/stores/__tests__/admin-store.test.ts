import { useAdminStore } from "../admin-store";

// Reset all stores before each test
beforeEach(() => {
  useAdminStore.getState().resetAdminState();
});

// Mock LinksItem data
const mockItems = [
  {
    id: "1",
    title: "Test Link 1",
    url: "https://example.com/1",
    category: "ai" as const,
    description: "Test link 1 description",
    tags: ["tag1", "tag2"],
    icon: "icon1",
    iconType: "image" as const,
    featured: false,
  },
  {
    id: "2",
    title: "Test Link 2",
    url: "https://example.com/2",
    category: "ai" as const,
    description: "Test link 2 description",
    tags: ["tag2", "tag3"],
    icon: "icon2",
    iconType: "image" as const,
    featured: false,
  },
];

describe("useAdminStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useAdminStore.getState();

      expect(state.items).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.searchTerm).toBe("");
      expect(state.selectedCategory).toBe("");
      expect(state.showAddDialog).toBe(false);
      expect(state.editingItem).toBeNull();
      expect(state.deletingItem).toBeNull();
      expect(state.itemCount).toBe(0);
    });
  });

  describe("Data Operations", () => {
    it("should set items", () => {
      const { setItems } = useAdminStore.getState();

      setItems(mockItems);
      expect(useAdminStore.getState().items).toEqual(mockItems);
      expect(useAdminStore.getState().itemCount).toBe(2);
    });

    it("should set loading state", () => {
      const { setLoading } = useAdminStore.getState();

      setLoading(true);
      expect(useAdminStore.getState().loading).toBe(true);

      setLoading(false);
      expect(useAdminStore.getState().loading).toBe(false);
    });

    it("should set error", () => {
      const { setError } = useAdminStore.getState();

      setError("Test error");
      expect(useAdminStore.getState().error).toBe("Test error");

      setError(null);
      expect(useAdminStore.getState().error).toBeNull();
    });

    it("should add item", () => {
      const { setItems, addItem } = useAdminStore.getState();

      // Set initial items
      setItems([mockItems[0]]);

      // Add new item
      addItem(mockItems[1]);

      expect(useAdminStore.getState().items).toEqual(mockItems);
      expect(useAdminStore.getState().itemCount).toBe(2);
    });

    it("should update item", () => {
      const { setItems, updateItem } = useAdminStore.getState();
      const updatedItem = { ...mockItems[0], title: "Updated Title" };

      // Set initial items
      setItems(mockItems);

      // Update item
      updateItem(updatedItem);

      expect(useAdminStore.getState().items[0]).toEqual(updatedItem);
      expect(useAdminStore.getState().items[1]).toEqual(mockItems[1]);
    });

    it("should delete item", () => {
      const { setItems, deleteItem } = useAdminStore.getState();

      // Set initial items
      setItems(mockItems);

      // Delete item
      deleteItem("1");

      expect(useAdminStore.getState().items).toEqual([mockItems[1]]);
      expect(useAdminStore.getState().itemCount).toBe(1);
    });
  });

  describe("Search and Filter Operations", () => {
    it("should set search term", () => {
      const { setSearchTerm } = useAdminStore.getState();

      setSearchTerm("test");
      expect(useAdminStore.getState().searchTerm).toBe("test");
    });

    it("should set selected category", () => {
      const { setSelectedCategory } = useAdminStore.getState();

      setSelectedCategory("test");
      expect(useAdminStore.getState().selectedCategory).toBe("test");
    });
  });

  describe("Dialog Operations", () => {
    it("should set show add dialog", () => {
      const { setShowAddDialog } = useAdminStore.getState();

      setShowAddDialog(true);
      expect(useAdminStore.getState().showAddDialog).toBe(true);

      setShowAddDialog(false);
      expect(useAdminStore.getState().showAddDialog).toBe(false);
    });

    it("should set editing item", () => {
      const { setEditingItem } = useAdminStore.getState();

      setEditingItem(mockItems[0]);
      expect(useAdminStore.getState().editingItem).toEqual(mockItems[0]);

      setEditingItem(null);
      expect(useAdminStore.getState().editingItem).toBeNull();
    });

    it("should set deleting item", () => {
      const { setDeletingItem } = useAdminStore.getState();

      setDeletingItem(mockItems[0]);
      expect(useAdminStore.getState().deletingItem).toEqual(mockItems[0]);

      setDeletingItem(null);
      expect(useAdminStore.getState().deletingItem).toBeNull();
    });
  });

  describe("Reset Operations", () => {
    it("should reset admin state", () => {
      const state = useAdminStore.getState();

      // Change states
      state.setItems(mockItems);
      state.setSearchTerm("test");
      state.setShowAddDialog(true);

      // Reset
      state.resetAdminState();

      // Check reset state
      expect(useAdminStore.getState().items).toEqual([]);
      expect(useAdminStore.getState().searchTerm).toBe("");
      expect(useAdminStore.getState().showAddDialog).toBe(false);
    });

    it("should reset filters", () => {
      const state = useAdminStore.getState();

      // Set filters
      state.setSearchTerm("test");
      state.setSelectedCategory("test");

      // Reset filters
      state.resetFilters();

      // Check reset filters
      expect(useAdminStore.getState().searchTerm).toBe("");
      expect(useAdminStore.getState().selectedCategory).toBe("");
    });
  });
});
