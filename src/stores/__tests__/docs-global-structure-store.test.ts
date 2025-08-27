import { useDocsGlobalStructureStore } from "../docs-global-structure-store";
import type { GlobalDocsStructure } from "@/features/docs/components/global-docs";
import type { SidebarItem } from "@/features/docs/types";

// Reset all stores before each test
beforeEach(() => {
  useDocsGlobalStructureStore.getState().resetDocsGlobalStructureState();
});

describe("useDocsGlobalStructureStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useDocsGlobalStructureStore.getState();

      expect(state.structure).toBeNull();
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.timestamp).toBe(0);
      // 检查派生状态
      expect(state.isCacheValid).toBe(false);
      expect(state.categories).toBeNull();
      expect(state.allDocs).toBeNull();
    });
  });

  describe("Actions", () => {
    it("should set structure", () => {
      const { setStructure } = useDocsGlobalStructureStore.getState();
      const mockStructure: GlobalDocsStructure = {
        categories: [],
        firstDocPath: "/docs",
        totalDocs: 0,
      };

      setStructure(mockStructure);
      expect(useDocsGlobalStructureStore.getState().structure).toEqual(mockStructure);
    });

    it("should set loading state", () => {
      const { setLoading } = useDocsGlobalStructureStore.getState();

      setLoading(false);
      expect(useDocsGlobalStructureStore.getState().loading).toBe(false);
    });

    it("should set error", () => {
      const { setError } = useDocsGlobalStructureStore.getState();
      const errorMessage = "Failed to load data";

      setError(errorMessage);
      expect(useDocsGlobalStructureStore.getState().error).toBe(errorMessage);
    });

    it("should set timestamp", () => {
      const { setTimestamp } = useDocsGlobalStructureStore.getState();
      const timestamp = Date.now();

      setTimestamp(timestamp);
      expect(useDocsGlobalStructureStore.getState().timestamp).toBe(timestamp);
    });

    it("should reset state", () => {
      const state = useDocsGlobalStructureStore.getState();

      // Change states
      state.setStructure({
        categories: [],
        firstDocPath: "/docs",
        totalDocs: 0,
      });
      state.setLoading(false);
      state.setError("Error");
      state.setTimestamp(1234567890);

      // Reset
      state.resetDocsGlobalStructureState();

      // Check reset state
      expect(useDocsGlobalStructureStore.getState().structure).toBeNull();
      expect(useDocsGlobalStructureStore.getState().loading).toBe(true);
      expect(useDocsGlobalStructureStore.getState().error).toBeNull();
      expect(useDocsGlobalStructureStore.getState().timestamp).toBe(0);
    });
  });

  describe("Derived State", () => {
    const mockDocs: SidebarItem[] = [
      {
        title: "Introduction",
        path: "/docs/getting-started/intro",
        href: "/docs/getting-started/intro",
      },
      {
        title: "Installation",
        path: "/docs/getting-started/install",
        href: "/docs/getting-started/install",
      },
    ];

    const mockStructure: GlobalDocsStructure = {
      categories: [
        {
          id: "getting-started",
          name: "Getting Started",
          title: "Getting Started",
          slug: "getting-started",
          docs: mockDocs,
          hasIndex: false,
        },
        {
          id: "api",
          name: "API",
          title: "API",
          slug: "api",
          docs: [
            {
              title: "Overview",
              path: "/docs/api/overview",
              href: "/docs/api/overview",
            },
          ],
          hasIndex: false,
        },
      ],
      firstDocPath: "/docs/getting-started/intro",
      totalDocs: 3,
    };

    beforeEach(() => {
      useDocsGlobalStructureStore.getState().setStructure(mockStructure);
    });

    it("should compute categories correctly", () => {
      const state = useDocsGlobalStructureStore.getState();
      expect(state.categories).toEqual(mockStructure.categories);
    });

    it("should compute allDocs correctly", () => {
      const state = useDocsGlobalStructureStore.getState();
      expect(state.allDocs).toEqual([
        {
          id: "Introduction",
          title: "Introduction",
          path: "/docs/getting-started/intro",
          category: "getting-started",
        },
        {
          id: "Installation",
          title: "Installation",
          path: "/docs/getting-started/install",
          category: "getting-started",
        },
        {
          id: "Overview",
          title: "Overview",
          path: "/docs/api/overview",
          category: "api",
        },
      ]);
    });

    it("should compute isCacheValid correctly", () => {
      const { setTimestamp } = useDocsGlobalStructureStore.getState();
      const now = Date.now();

      // 设置较新的时间戳，缓存应该有效
      setTimestamp(now - 1000); // 1秒前
      expect(useDocsGlobalStructureStore.getState().isCacheValid).toBe(true);

      // 设置较旧的时间戳，缓存应该无效
      setTimestamp(now - 10 * 60 * 1000); // 10分钟前
      expect(useDocsGlobalStructureStore.getState().isCacheValid).toBe(false);
    });
  });

  describe("Cache Validation", () => {
    it("should validate cache correctly", () => {
      const { isCacheValid } = require("../docs-global-structure-store");
      const now = Date.now();

      // Cache should be valid if timestamp is recent
      expect(isCacheValid(now - 1000)).toBe(true); // 1 second ago

      // Cache should be invalid if timestamp is old
      expect(isCacheValid(now - 10 * 60 * 1000)).toBe(false); // 10 minutes ago
    });
  });
});
