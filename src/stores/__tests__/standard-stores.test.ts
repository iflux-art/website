import { describe, it, expect } from "vitest";
import { useAppStore } from "../app-store.standard";
import { useBlogPageStore } from "../blog-page-store.standard";
import { useBlogStore } from "../blog-store.standard";
import { useDocsGlobalStructureStore } from "../docs-global-structure-store.standard";
import { useDocsStore } from "../docs-store.standard";
import { useFriendsStore } from "../friends-store.standard";
import { useLayoutStore } from "../layout-store.standard";
import { useNavbarStore } from "../navbar-store.standard";
import { useSearchStore } from "../search-store.standard";
import { useThemeStore } from "../theme-store.standard";

describe("Standard Stores", () => {
  describe("useAppStore", () => {
    it("should initialize with correct default state", () => {
      const store = useAppStore.getState();
      expect(store.isSidebarOpen).toBe(false);
      expect(store.isSearchOpen).toBe(false);
      expect(store.isMobile).toBe(false);
      expect(store.theme).toBe("system");
    });

    it("should have all required actions", () => {
      const store = useAppStore.getState();
      expect(typeof store.setIsSidebarOpen).toBe("function");
      expect(typeof store.setIsSearchOpen).toBe("function");
      expect(typeof store.toggleSidebar).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useBlogPageStore", () => {
    it("should initialize with correct default state", () => {
      const store = useBlogPageStore.getState();
      expect(store.posts).toEqual([]);
      expect(store.loading).toBe(true);
      expect(store.category).toBeUndefined();
    });

    it("should have all required actions", () => {
      const store = useBlogPageStore.getState();
      expect(typeof store.setPosts).toBe("function");
      expect(typeof store.setLoading).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useBlogStore", () => {
    it("should initialize with correct default state", () => {
      const store = useBlogStore.getState();
      expect(store.posts).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.selectedCategory).toBeNull();
    });

    it("should have all required actions", () => {
      const store = useBlogStore.getState();
      expect(typeof store.setPosts).toBe("function");
      expect(typeof store.setLoading).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useDocsGlobalStructureStore", () => {
    it("should initialize with correct default state", () => {
      const store = useDocsGlobalStructureStore.getState();
      expect(store.structure).toBeNull();
      expect(store.loading).toBe(true);
      expect(store.error).toBeNull();
    });

    it("should have all required actions", () => {
      const store = useDocsGlobalStructureStore.getState();
      expect(typeof store.setStructure).toBe("function");
      expect(typeof store.setLoading).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useDocsStore", () => {
    it("should initialize with correct default state", () => {
      const store = useDocsStore.getState();
      expect(store.categories).toEqual([]);
      expect(store.currentDoc).toBeNull();
      expect(store.loading).toBe(false);
    });

    it("should have all required actions", () => {
      const store = useDocsStore.getState();
      expect(typeof store.setCategories).toBe("function");
      expect(typeof store.setCurrentDoc).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useFriendsStore", () => {
    it("should initialize with correct default state", () => {
      const store = useFriendsStore.getState();
      expect(store.friendsItems).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should have all required actions", () => {
      const store = useFriendsStore.getState();
      expect(typeof store.setFriendsItems).toBe("function");
      expect(typeof store.setLoading).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useLayoutStore", () => {
    it("should initialize with correct default state", () => {
      const store = useLayoutStore.getState();
      expect(store.layoutType).toBe("full-width");
      expect(store.sidebars).toEqual([]);
      expect(store.isMobile).toBe(false);
    });

    it("should have all required actions", () => {
      const store = useLayoutStore.getState();
      expect(typeof store.setLayoutType).toBe("function");
      expect(typeof store.setSidebars).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useNavbarStore", () => {
    it("should initialize with correct default state", () => {
      const store = useNavbarStore.getState();
      expect(store.direction).toBe("up");
      expect(store.position).toBe(0);
      expect(store.showTitle).toBe(false);
    });

    it("should have all required actions", () => {
      const store = useNavbarStore.getState();
      expect(typeof store.setScrollPosition).toBe("function");
      expect(typeof store.setPageTitle).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useSearchStore", () => {
    it("should initialize with correct default state", () => {
      const store = useSearchStore.getState();
      expect(store.searchTerm).toBe("");
      expect(store.selectedCategory).toBe("");
    });

    it("should have all required actions", () => {
      const store = useSearchStore.getState();
      expect(typeof store.setSearchTerm).toBe("function");
      expect(typeof store.setSelectedCategory).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });

  describe("useThemeStore", () => {
    it("should initialize with correct default state", () => {
      const store = useThemeStore.getState();
      expect(store.theme).toBe("system");
      expect(store.resolvedTheme).toBe("light");
      expect(store.mounted).toBe(false);
    });

    it("should have all required actions", () => {
      const store = useThemeStore.getState();
      expect(typeof store.setTheme).toBe("function");
      expect(typeof store.setResolvedTheme).toBe("function");
      expect(typeof store.resetState).toBe("function");
    });
  });
});
