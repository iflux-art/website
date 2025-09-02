import { useLayoutStore, BREAKPOINTS } from "../layout-store.standard";

// Reset all stores before each test
beforeEach(() => {
  useLayoutStore.getState().resetState();
});

describe("useLayoutStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useLayoutStore.getState();

      expect(state.layoutType).toBe("full-width");
      expect(state.sidebars).toEqual([]);
      expect(state.isMobile).toBe(false);
      expect(state.isTablet).toBe(false);
      expect(state.isDesktop).toBe(true);
      expect(state.containerConfig).toEqual({
        className: "",
        minHeight: "min-h-screen",
      });
    });
  });

  describe("Actions", () => {
    it("should set layout type", () => {
      const { setLayoutType } = useLayoutStore.getState();

      setLayoutType("double-sidebar");
      expect(useLayoutStore.getState().layoutType).toBe("double-sidebar");
    });

    it("should set sidebars", () => {
      const { setSidebars } = useLayoutStore.getState();
      const sidebars = [
        { position: "left" as const, content: "Left" },
        { position: "right" as const, content: "Right" },
      ];

      setSidebars(sidebars);
      expect(useLayoutStore.getState().sidebars).toEqual(sidebars);
    });

    it("should set responsive states", () => {
      const { setIsMobile, setIsTablet, setIsDesktop } = useLayoutStore.getState();

      setIsMobile(true);
      expect(useLayoutStore.getState().isMobile).toBe(true);

      setIsTablet(true);
      expect(useLayoutStore.getState().isTablet).toBe(true);

      setIsDesktop(false);
      expect(useLayoutStore.getState().isDesktop).toBe(false);
    });

    it("should set container config", () => {
      const { setContainerConfig } = useLayoutStore.getState();

      setContainerConfig({ className: "test-class", minHeight: "min-h-full" });
      expect(useLayoutStore.getState().containerConfig).toEqual({
        className: "test-class",
        minHeight: "min-h-full",
      });
    });

    it("should update responsive state based on width", () => {
      const { updateResponsiveState } = useLayoutStore.getState();

      // Mobile
      updateResponsiveState(BREAKPOINTS.mobile - 1);
      expect(useLayoutStore.getState().isMobile).toBe(true);
      expect(useLayoutStore.getState().isTablet).toBe(false);
      expect(useLayoutStore.getState().isDesktop).toBe(false);

      // Tablet
      updateResponsiveState(BREAKPOINTS.mobile);
      expect(useLayoutStore.getState().isMobile).toBe(false);
      expect(useLayoutStore.getState().isTablet).toBe(true);
      expect(useLayoutStore.getState().isDesktop).toBe(false);

      // Desktop
      updateResponsiveState(BREAKPOINTS.tablet);
      expect(useLayoutStore.getState().isMobile).toBe(false);
      expect(useLayoutStore.getState().isTablet).toBe(false);
      expect(useLayoutStore.getState().isDesktop).toBe(true);
    });

    it("should reset layout state", () => {
      const state = useLayoutStore.getState();

      // Change states
      state.setLayoutType("double-sidebar");
      state.setIsMobile(true);

      // Reset
      state.resetState();

      // Check reset state
      expect(useLayoutStore.getState().layoutType).toBe("full-width");
      expect(useLayoutStore.getState().isMobile).toBe(false);
    });
  });
});
